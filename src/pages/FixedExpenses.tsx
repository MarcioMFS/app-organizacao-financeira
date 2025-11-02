import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useFinancialStore } from '../store/financialStore'
import { useDataStore } from '../store/dataStore'
import { FixedExpense } from '../types'
import { format, startOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function FixedExpenses() {
  const { user, couple } = useAuthStore()
  const { fixedExpenses, fetchFixedExpenses, addFixedExpense, updateFixedExpense, deleteFixedExpense } = useFinancialStore()
  const { categories } = useDataStore()
  const [showModal, setShowModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(null)

  useEffect(() => {
    if (couple?.id) {
      fetchFixedExpenses(couple.id)
    }
  }, [couple?.id, fetchFixedExpenses])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!couple?.id || !user?.id) return

    const formData = new FormData(e.currentTarget)
    const isInstallment = formData.get('isInstallment') === 'on'

    const expenseData: any = {
      coupleId: couple.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      amount: parseFloat(formData.get('amount') as string),
      categoryId: formData.get('categoryId') as string,
      owner: formData.get('owner') as any,
      dueDay: parseInt(formData.get('dueDay') as string),
      paymentMethod: (formData.get('paymentMethod') as any) || undefined,
      isInstallment,
      isActive: true,
      notes: formData.get('notes') as string || undefined,
      createdBy: user.id,
    }

    if (isInstallment) {
      expenseData.installmentNumber = parseInt(formData.get('installmentNumber') as string) || 1
      expenseData.totalInstallments = parseInt(formData.get('totalInstallments') as string)
      expenseData.startDate = new Date(formData.get('startDate') as string)
      expenseData.endDate = new Date(formData.get('endDate') as string)
    }

    try {
      if (editingExpense) {
        await updateFixedExpense(editingExpense.id, expenseData)
        alert('Gasto fixo atualizado com sucesso!')
      } else {
        await addFixedExpense(expenseData)
        alert('Gasto fixo criado com sucesso!')
      }
      setShowModal(false)
      setEditingExpense(null)
      e.currentTarget.reset()
    } catch (error: any) {
      console.error('Error saving expense:', error)
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error)
      alert(`Erro ao salvar gasto fixo: ${errorMessage}`)
      // Não fecha o modal para o usuário poder tentar novamente
    }
  }

  const handleEdit = (expense: FixedExpense) => {
    setEditingExpense(expense)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir este gasto fixo?')) {
      try {
        await deleteFixedExpense(id)
      } catch (error) {
        console.error('Error deleting expense:', error)
        alert('Erro ao excluir gasto fixo')
      }
    }
  }

  const activeExpenses = fixedExpenses.filter(e => e.isActive)
  const installments = activeExpenses.filter(e => e.isInstallment)
  const regular = activeExpenses.filter(e => !e.isInstallment)

  const getOwnerLabel = (owner: string) => {
    if (owner === 'person_a') return couple?.personAName
    if (owner === 'person_b') return couple?.personBName
    if (owner === 'both') return 'Ambos'
    return 'Proporcional'
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Sem categoria'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gastos Fixos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie despesas recorrentes e parceladas
          </p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Novo Gasto Fixo
        </button>
      </div>

      {/* Gastos Fixos Regulares */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gastos Mensais Fixos
        </h2>
        <div className="space-y-3">
          {regular.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhum gasto fixo cadastrado
            </p>
          ) : (
            regular.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {expense.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getCategoryName(expense.categoryId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Dia {expense.dueDay}
                    </span>
                    <span>{getOwnerLabel(expense.owner)}</span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {expense.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Parcelamentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Parcelamentos Ativos
        </h2>
        <div className="space-y-3">
          {installments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhum parcelamento ativo
            </p>
          ) : (
            installments.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {expense.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                      {expense.installmentNumber}/{expense.totalInstallments}x
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {expense.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Dia {expense.dueDay}
                    </span>
                    <span>{getOwnerLabel(expense.owner)}</span>
                    {expense.endDate && (
                      <span className="text-xs">
                        Até {format(expense.endDate, 'MMM/yyyy', { locale: ptBR })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingExpense ? 'Editar Gasto Fixo' : 'Novo Gasto Fixo'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingExpense?.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingExpense?.description}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      defaultValue={editingExpense?.amount}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia do Vencimento *
                    </label>
                    <input
                      type="number"
                      name="dueDay"
                      min="1"
                      max="31"
                      defaultValue={editingExpense?.dueDay}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoria *
                    </label>
                    <select
                      name="categoryId"
                      defaultValue={editingExpense?.categoryId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecione...</option>
                      {categories.filter(c => c.type === 'expense').map(category => (
                        <option key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Responsável *
                    </label>
                    <select
                      name="owner"
                      defaultValue={editingExpense?.owner}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="person_a">{couple?.personAName}</option>
                      <option value="person_b">{couple?.personBName}</option>
                      <option value="both">Ambos</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isInstallment"
                      defaultChecked={editingExpense?.isInstallment}
                      className="rounded"
                      id="isInstallment"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      É um parcelamento?
                    </span>
                  </label>
                </div>

                <div id="installmentFields" className="space-y-4 hidden">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Parcela Atual
                      </label>
                      <input
                        type="number"
                        name="installmentNumber"
                        min="1"
                        defaultValue={editingExpense?.installmentNumber || 1}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Total de Parcelas
                      </label>
                      <input
                        type="number"
                        name="totalInstallments"
                        min="1"
                        defaultValue={editingExpense?.totalInstallments}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data de Início
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={editingExpense?.startDate ? format(editingExpense.startDate, 'yyyy-MM-dd') : ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Data de Término
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        defaultValue={editingExpense?.endDate ? format(editingExpense.endDate, 'yyyy-MM-dd') : ''}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editingExpense?.notes}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingExpense(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingExpense ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('isInstallment')?.addEventListener('change', function(e) {
              const fields = document.getElementById('installmentFields');
              if (e.target.checked) {
                fields.classList.remove('hidden');
              } else {
                fields.classList.add('hidden');
              }
            });
          `
        }}
      />
    </div>
  )
}
