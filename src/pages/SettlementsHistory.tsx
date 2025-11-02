import { useEffect, useState } from 'react'
import { Plus, CheckCircle, Calendar, DollarSign, Filter } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useFinancialStore } from '../store/financialStore'
import { DebtSettlement } from '../types'
import { format, startOfYear, endOfYear, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function SettlementsHistory() {
  const { user, couple } = useAuthStore()
  const { debtSettlements, fetchDebtSettlements, addDebtSettlement } = useFinancialStore()
  const [showModal, setShowModal] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filterOwner, setFilterOwner] = useState<string>('all')

  useEffect(() => {
    if (couple?.id) {
      fetchDebtSettlements(couple.id)
    }
  }, [couple?.id, fetchDebtSettlements])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!couple?.id || !user?.id) return

    const formData = new FormData(e.currentTarget)

    const settlementData: any = {
      coupleId: couple.id,
      referenceType: formData.get('referenceType') as any,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      originalAmount: parseFloat(formData.get('originalAmount') as string),
      settledAmount: parseFloat(formData.get('settledAmount') as string),
      owner: formData.get('owner') as any,
      settlementDate: new Date(formData.get('settlementDate') as string),
      originalDueDate: formData.get('originalDueDate') ? new Date(formData.get('originalDueDate') as string) : undefined,
      notes: formData.get('notes') as string || undefined,
      createdBy: user.id,
    }

    try {
      await addDebtSettlement(settlementData)
      setShowModal(false)
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error saving settlement:', error)
      alert('Erro ao salvar quitação')
    }
  }

  // Filtrar por ano e dono
  const filteredSettlements = debtSettlements.filter(settlement => {
    const yearStart = startOfYear(new Date(selectedYear, 0, 1))
    const yearEnd = endOfYear(new Date(selectedYear, 0, 1))
    const inYear = isWithinInterval(settlement.settlementDate, { start: yearStart, end: yearEnd })
    const matchesOwner = filterOwner === 'all' || settlement.owner === filterOwner

    return inYear && matchesOwner
  })

  // Agrupar por mês
  const settlementsByMonth = filteredSettlements.reduce((acc, settlement) => {
    const month = format(settlement.settlementDate, 'yyyy-MM')
    if (!acc[month]) acc[month] = []
    acc[month].push(settlement)
    return acc
  }, {} as Record<string, DebtSettlement[]>)

  // Calcular totais
  const totals = filteredSettlements.reduce(
    (acc, settlement) => {
      acc.originalAmount += settlement.originalAmount
      acc.settledAmount += settlement.settledAmount
      acc.saved += settlement.originalAmount - settlement.settledAmount
      return acc
    },
    { originalAmount: 0, settledAmount: 0, saved: 0 }
  )

  const getOwnerLabel = (owner: string) => {
    if (owner === 'person_a') return couple?.personAName
    if (owner === 'person_b') return couple?.personBName
    return 'Ambos'
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fixed_expense: 'Gasto Fixo',
      installment: 'Parcela',
      transaction: 'Transação',
      other: 'Outro',
    }
    return labels[type] || type
  }

  // Anos disponíveis
  const availableYears = Array.from(
    new Set(debtSettlements.map(s => s.settlementDate.getFullYear()))
  ).sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Histórico de Quitações</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe tudo que foi quitado e economizado
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Registrar Quitação
        </button>
      </div>

      {/* Filtros e Resumo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Ano
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              {availableYears.length === 0 ? (
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
              ) : (
                availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Responsável
            </label>
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="person_a">{couple?.personAName}</option>
              <option value="person_b">{couple?.personBName}</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 w-full">
              <div className="text-sm opacity-90">Economia Total</div>
              <div className="text-2xl font-bold">
                {totals.saved.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Valor Original Total</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {totals.originalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Valor Quitado Total</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {totals.settledAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total de Quitações</div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
              {filteredSettlements.length}
            </div>
          </div>
        </div>
      </div>

      {/* Lista por Mês */}
      {Object.keys(settlementsByMonth).length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
          <CheckCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma quitação registrada em {selectedYear}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(settlementsByMonth)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, settlements]) => (
              <div key={month} className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                    {format(new Date(month + '-01'), 'MMMM yyyy', { locale: ptBR })}
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  {settlements.map((settlement) => (
                    <div
                      key={settlement.id}
                      className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {settlement.name}
                          </h4>
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                            {getTypeLabel(settlement.referenceType)}
                          </span>
                        </div>
                        {settlement.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {settlement.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {format(settlement.settlementDate, 'dd/MM/yyyy')}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {getOwnerLabel(settlement.owner)}
                          </span>
                          <span className="line-through text-red-500">
                            {settlement.originalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            {settlement.settledAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          {settlement.originalAmount !== settlement.settledAmount && (
                            <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                              Economizou {(settlement.originalAmount - settlement.settledAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Registrar Quitação
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome da Dívida/Gasto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Ex: Parcela do celular, Empréstimo pessoal"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo *
                  </label>
                  <select
                    name="referenceType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="fixed_expense">Gasto Fixo</option>
                    <option value="installment">Parcela</option>
                    <option value="transaction">Transação Avulsa</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor Original *
                    </label>
                    <input
                      type="number"
                      name="originalAmount"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor Quitado *
                    </label>
                    <input
                      type="number"
                      name="settledAmount"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Responsável *
                    </label>
                    <select
                      name="owner"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="person_a">{couple?.personAName}</option>
                      <option value="person_b">{couple?.personBName}</option>
                      <option value="both">Ambos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data da Quitação *
                    </label>
                    <input
                      type="date"
                      name="settlementDate"
                      defaultValue={format(new Date(), 'yyyy-MM-dd')}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Data do Vencimento Original
                  </label>
                  <input
                    type="date"
                    name="originalDueDate"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
