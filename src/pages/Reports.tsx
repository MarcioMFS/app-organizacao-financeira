import { useState, useMemo } from 'react'
import { useDataStore } from '../store/dataStore'
import { useFinancialStore } from '../store/financialStore'
import { useAuthStore } from '../store/authStore'
import { Calendar, Download, Filter, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Reports() {
  const { transactions, categories } = useDataStore()
  const { fixedExpenses, fixedIncomes } = useFinancialStore()
  const { couple } = useAuthStore()

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterOwner, setFilterOwner] = useState<'all' | 'person_a' | 'person_b' | 'both'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Gerar lista de meses disponíveis (últimos 12 meses)
  const availableMonths = useMemo(() => {
    const months = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy', { locale: ptBR })
      })
    }
    return months
  }, [])

  // Processar dados do mês selecionado
  const monthlyReport = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number)
    const monthStart = startOfMonth(new Date(year, month - 1))
    const monthEnd = endOfMonth(new Date(year, month - 1))

    // Transações do mês
    const monthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return isWithinInterval(date, { start: monthStart, end: monthEnd })
    })

    // Gastos fixos ativos
    const activeFixedExpenses = fixedExpenses.filter(fe => {
      if (!fe.isActive) return false
      if (fe.isInstallment && fe.endDate) {
        const endDate = new Date(fe.endDate)
        if (endDate < monthStart) return false
      }
      return true
    })

    // Receitas fixas ativas
    const activeFixedIncomes = fixedIncomes.filter(fi => {
      if (!fi.isActive) return false
      const startDate = new Date(fi.startDate)
      if (startDate > monthEnd) return false
      if (fi.endDate) {
        const endDate = new Date(fi.endDate)
        if (endDate < monthStart) return false
      }
      return true
    })

    // Combinar tudo em um extrato único
    const allItems = [
      ...monthTransactions.map(t => ({
        id: t.id,
        date: new Date(t.date),
        description: t.description,
        category: categories.find(c => c.id === t.categoryId)?.name || 'Sem categoria',
        categoryIcon: categories.find(c => c.id === t.categoryId)?.icon || '💰',
        amount: t.amount,
        type: t.type,
        owner: t.owner,
        source: 'transaction' as const,
        notes: t.notes
      })),
      ...activeFixedExpenses.map(fe => ({
        id: fe.id,
        date: new Date(year, month - 1, fe.dueDay),
        description: fe.name + (fe.isInstallment ? ` (${fe.installmentNumber}/${fe.totalInstallments})` : ''),
        category: categories.find(c => c.id === fe.categoryId)?.name || 'Sem categoria',
        categoryIcon: categories.find(c => c.id === fe.categoryId)?.icon || '💰',
        amount: fe.amount,
        type: 'expense' as const,
        owner: fe.owner,
        source: 'fixed_expense' as const,
        notes: fe.notes
      })),
      ...activeFixedIncomes.map(fi => ({
        id: fi.id,
        date: new Date(year, month - 1, fi.receiptDay),
        description: fi.name,
        category: categories.find(c => c.id === fi.categoryId)?.name || 'Sem categoria',
        categoryIcon: categories.find(c => c.id === fi.categoryId)?.icon || '💰',
        amount: fi.amount,
        type: 'income' as const,
        owner: fi.owner,
        source: 'fixed_income' as const,
        notes: fi.notes
      }))
    ]

    // Aplicar filtros
    let filteredItems = allItems

    if (filterType !== 'all') {
      filteredItems = filteredItems.filter(item => item.type === filterType)
    }

    if (filterOwner !== 'all') {
      filteredItems = filteredItems.filter(item => {
        if (filterOwner === 'both') return item.owner === 'both'
        return item.owner === filterOwner || item.owner === 'both'
      })
    }

    if (filterCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === filterCategory)
    }

    // Ordenar por data (mais recente primeiro)
    filteredItems.sort((a, b) => b.date.getTime() - a.date.getTime())

    // Calcular totais
    const totalIncome = allItems
      .filter(i => i.type === 'income')
      .reduce((sum, i) => sum + i.amount, 0)

    const totalExpense = allItems
      .filter(i => i.type === 'expense')
      .reduce((sum, i) => sum + i.amount, 0)

    const balance = totalIncome - totalExpense

    return {
      items: filteredItems,
      totalIncome,
      totalExpense,
      balance,
      itemCount: filteredItems.length
    }
  }, [selectedMonth, transactions, fixedExpenses, fixedIncomes, categories, filterType, filterOwner, filterCategory])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: couple?.currency || 'BRL',
    }).format(value)
  }

  const getOwnerLabel = (owner: string) => {
    if (owner === 'person_a') return couple?.personAName
    if (owner === 'person_b') return couple?.personBName
    if (owner === 'both') return 'Ambos'
    return 'Proporcional'
  }

  const getSourceLabel = (source: string) => {
    if (source === 'transaction') return 'Lançamento'
    if (source === 'fixed_expense') return 'Gasto Fixo'
    if (source === 'fixed_income') return 'Receita Fixa'
    return source
  }

  const exportToCSV = () => {
    const header = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Responsável', 'Origem']
    const rows = monthlyReport.items.map(item => [
      format(item.date, 'dd/MM/yyyy'),
      item.description,
      item.category,
      item.type === 'income' ? 'Receita' : 'Despesa',
      item.amount.toFixed(2),
      getOwnerLabel(item.owner),
      getSourceLabel(item.source)
    ])

    const csv = [header, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `extrato-${selectedMonth}.csv`
    link.click()
  }

  // Categorias únicas para o filtro
  const uniqueCategories = useMemo(() => {
    const cats = new Set(monthlyReport.items.map(i => i.category))
    return Array.from(cats).sort()
  }, [monthlyReport.items])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios Detalhados</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Extrato completo com filtros personalizados
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Mês/Ano
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {availableMonths.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsável
            </label>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="person_a">{couple?.personAName}</option>
              <option value="person_b">{couple?.personBName}</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Receitas</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(monthlyReport.totalIncome)}</div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Despesas</span>
            <TrendingDown className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(monthlyReport.totalExpense)}</div>
        </div>

        <div className={`bg-gradient-to-br ${monthlyReport.balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-lg p-6 text-white`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Saldo</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(monthlyReport.balance)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-90">Lançamentos</span>
            <span className="text-2xl font-bold">{monthlyReport.itemCount}</span>
          </div>
          <button
            onClick={exportToCSV}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-sm transition"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Extrato Detalhado */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Extrato Detalhado - {availableMonths.find(m => m.value === selectedMonth)?.label}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {monthlyReport.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    Nenhum lançamento encontrado com os filtros selecionados
                  </td>
                </tr>
              ) : (
                monthlyReport.items.map((item) => (
                  <tr key={`${item.source}-${item.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {format(item.date, 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.categoryIcon}</span>
                        <div>
                          <div className="font-medium">{item.description}</div>
                          {item.notes && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.notes}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getOwnerLabel(item.owner)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.source === 'transaction'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : item.source === 'fixed_expense'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {getSourceLabel(item.source)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${
                      item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
