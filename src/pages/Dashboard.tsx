import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDataStore } from '../store/dataStore'
import { useFinancialStore } from '../store/financialStore'
import { useAuthStore } from '../store/authStore'
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, Plus } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444']

export default function Dashboard() {
  const { transactions, categories } = useDataStore()
  const { fixedExpenses, fixedIncomes } = useFinancialStore()
  const { couple } = useAuthStore()

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  // DEBUG: Mostrar todas as receitas fixas
  console.log('=== DEBUG RECEITAS FIXAS ===')
  console.log('Mês atual:', currentMonth, 'Ano atual:', currentYear)
  console.log('Total de receitas fixas:', fixedIncomes.length)
  fixedIncomes.forEach((fi, index) => {
    console.log(`Receita ${index + 1}:`, {
      nome: fi.name,
      isActive: fi.isActive,
      startDate: fi.startDate,
      endDate: fi.endDate,
      amount: fi.amount
    })
  })

  const monthlyData = useMemo(() => {
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Receitas de transações
    let income = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    // Adicionar receitas fixas ativas
    const activeFixedIncomes = fixedIncomes.filter(fi => {
      console.log('Verificando receita:', fi.name)

      if (!fi.isActive) {
        console.log('  ❌ Não está ativa')
        return false
      }
      console.log('  ✓ Está ativa')

      const startDate = new Date(fi.startDate)
      console.log('  Data início:', startDate, '- Mês:', startDate.getMonth(), 'Ano:', startDate.getFullYear())

      if (startDate.getFullYear() > currentYear ||
          (startDate.getFullYear() === currentYear && startDate.getMonth() > currentMonth)) {
        console.log('  ❌ Data de início é no futuro')
        return false
      }
      console.log('  ✓ Data de início OK')

      if (fi.endDate) {
        const endDate = new Date(fi.endDate)
        console.log('  Data fim:', endDate, '- Mês:', endDate.getMonth(), 'Ano:', endDate.getFullYear())
        if (endDate.getFullYear() < currentYear ||
            (endDate.getFullYear() === currentYear && endDate.getMonth() < currentMonth)) {
          console.log('  ❌ Receita já terminou')
          return false
        }
        console.log('  ✓ Data de fim OK')
      } else {
        console.log('  ✓ Receita indeterminada (sem data fim)')
      }

      console.log('  ✅ INCLUÍDA!')
      return true
    })
    console.log('Total de receitas fixas ativas:', activeFixedIncomes.length)
    console.log('Valor total receitas fixas:', activeFixedIncomes.reduce((sum, fi) => sum + fi.amount, 0))
    income += activeFixedIncomes.reduce((sum, fi) => sum + fi.amount, 0)

    // Despesas de transações
    let expense = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    // Adicionar gastos fixos ativos
    const activeFixedExpenses = fixedExpenses.filter(fe => {
      if (!fe.isActive) return false
      if (fe.isInstallment && fe.endDate) {
        const endDate = new Date(fe.endDate)
        if (endDate.getFullYear() < currentYear ||
            (endDate.getFullYear() === currentYear && endDate.getMonth() < currentMonth)) return false
      }
      return true
    })
    expense += activeFixedExpenses.reduce((sum, fe) => sum + fe.amount, 0)

    const personAIncome = currentMonthTransactions
      .filter((t) => t.type === 'income' && (t.owner === 'person_a' || t.owner === 'both'))
      .reduce((sum, t) => {
        if (t.owner === 'both') return sum + t.amount / 2
        return sum + t.amount
      }, 0)

    const personBIncome = currentMonthTransactions
      .filter((t) => t.type === 'income' && (t.owner === 'person_b' || t.owner === 'both'))
      .reduce((sum, t) => {
        if (t.owner === 'both') return sum + t.amount / 2
        return sum + t.amount
      }, 0)

    const personAExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense' && (t.owner === 'person_a' || t.owner === 'both'))
      .reduce((sum, t) => {
        if (t.owner === 'both') return sum + t.amount / 2
        if (t.owner === 'proportional') return sum + (t.amount * (t.proportionA || 50)) / 100
        return sum + t.amount
      }, 0)

    const personBExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense' && (t.owner === 'person_b' || t.owner === 'both'))
      .reduce((sum, t) => {
        if (t.owner === 'both') return sum + t.amount / 2
        if (t.owner === 'proportional') return sum + (t.amount * (t.proportionB || 50)) / 100
        return sum + t.amount
      }, 0)

    const balance = income - expense
    const savingsRate = income > 0 ? ((balance / income) * 100) : 0

    return {
      income,
      expense,
      balance,
      savingsRate,
      personAIncome,
      personBIncome,
      personAExpense,
      personBExpense,
    }
  }, [transactions, fixedExpenses, fixedIncomes, currentMonth, currentYear])

  const categoryExpenses = useMemo(() => {
    const currentMonthExpenses = transactions.filter((t) => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear && t.type === 'expense'
    })

    const grouped = currentMonthExpenses.reduce((acc, t) => {
      const category = categories.find((c) => c.id === t.categoryId)
      if (!category) return acc

      if (!acc[category.id]) {
        acc[category.id] = {
          name: category.name,
          icon: category.icon,
          value: 0,
        }
      }

      acc[category.id].value += t.amount
      return acc
    }, {} as Record<string, { name: string; icon: string; value: number }>)

    return Object.values(grouped)
      .sort((a, b) => b.value - a.value)
      .slice(0, 7)
  }, [transactions, categories, currentMonth, currentYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: couple?.currency || 'BRL',
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visão geral do mês atual
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Lançamento</span>
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Receitas</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(monthlyData.income)}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {couple?.personAName}: {formatCurrency(monthlyData.personAIncome)} | {couple?.personBName}: {formatCurrency(monthlyData.personBIncome)}
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Despesas</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(monthlyData.expense)}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {couple?.personAName}: {formatCurrency(monthlyData.personAExpense)} | {couple?.personBName}: {formatCurrency(monthlyData.personBExpense)}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Saldo</span>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <div className={`text-2xl font-bold ${monthlyData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(monthlyData.balance)}
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Receitas - Despesas
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Taxa de Economia</span>
            <PiggyBank className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {monthlyData.savingsRate.toFixed(1)}%
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Do total de receitas
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribuição por Categoria
          </h3>

          {categoryExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryExpenses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhuma despesa registrada este mês
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Maiores Gastos
          </h3>

          {categoryExpenses.length > 0 ? (
            <div className="space-y-4">
              {categoryExpenses.map((category, index) => {
                const percentage = monthlyData.expense > 0 ? (category.value / monthlyData.expense) * 100 : 0

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Nenhuma despesa registrada este mês
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lançamentos Recentes
          </h3>
          <Link
            to="/transactions"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            Ver todos
          </Link>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => {
              const category = categories.find((c) => c.id === transaction.categoryId)
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{category?.icon || '💰'}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {category?.name} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">
            Nenhum lançamento ainda. Comece adicionando suas receitas e despesas!
          </div>
        )}
      </div>
    </div>
  )
}
