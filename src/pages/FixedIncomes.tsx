import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, DollarSign } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useFinancialStore } from '../store/financialStore'
import { useDataStore } from '../store/dataStore'
import { FixedIncome } from '../types'
import { format } from 'date-fns'

export default function FixedIncomes() {
  const { user, couple } = useAuthStore()
  const { fixedIncomes, fetchFixedIncomes, addFixedIncome, updateFixedIncome, deleteFixedIncome } = useFinancialStore()
  const { categories } = useDataStore()
  const [showModal, setShowModal] = useState(false)
  const [editingIncome, setEditingIncome] = useState<FixedIncome | null>(null)

  useEffect(() => {
    if (couple?.id) {
      fetchFixedIncomes(couple.id)
    }
  }, [couple?.id, fetchFixedIncomes])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!couple?.id || !user?.id) return

    const formData = new FormData(e.currentTarget)
    const isIndefinite = formData.get('isIndefinite') === 'on'

    const incomeData: any = {
      coupleId: couple.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      amount: parseFloat(formData.get('amount') as string),
      categoryId: formData.get('categoryId') as string,
      owner: formData.get('owner') as any,
      receiptDay: parseInt(formData.get('receiptDay') as string),
      isIndefinite,
      startDate: new Date(formData.get('startDate') as string),
      endDate: isIndefinite ? undefined : new Date(formData.get('endDate') as string),
      isActive: true,
      notes: formData.get('notes') as string || undefined,
      createdBy: user.id,
    }

    try {
      if (editingIncome) {
        await updateFixedIncome(editingIncome.id, incomeData)
      } else {
        await addFixedIncome(incomeData)
      }

      setShowModal(false)
      setEditingIncome(null)

      setTimeout(() => {
        alert(editingIncome ? 'Receita fixa atualizada com sucesso!' : 'Receita fixa criada com sucesso!')
      }, 100)
    } catch (error: any) {
      console.error('Error saving income:', error)
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error)
      alert(`Erro ao salvar receita fixa: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta receita fixa?')) {
      try {
        await deleteFixedIncome(id)
      } catch (error) {
        alert('Erro ao excluir receita fixa')
      }
    }
  }

  const activeIncomes = fixedIncomes.filter(i => i.isActive)

  const getOwnerLabel = (owner: string) => {
    if (owner === 'person_a') return couple?.personAName
    if (owner === 'person_b') return couple?.personBName
    return 'Ambos'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Receitas Fixas</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie suas fontes de renda recorrentes
          </p>
        </div>
        <button
          onClick={() => {
            setEditingIncome(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-5 h-5" />
          Nova Receita Fixa
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="space-y-3">
          {activeIncomes.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhuma receita fixa cadastrada
            </p>
          ) : (
            activeIncomes.map((income) => (
              <div
                key={income.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {income.name}
                    </h3>
                    {income.isIndefinite ? (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                        Indeterminado
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        Até {format(income.endDate!, 'MM/yyyy')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {income.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Dia {income.receiptDay}
                    </span>
                    <span>{getOwnerLabel(income.owner)}</span>
                  </div>
                  {income.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {income.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingIncome(income)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(income.id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingIncome ? 'Editar Receita Fixa' : 'Nova Receita Fixa'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingIncome?.name}
                    required
                    placeholder="Ex: Salário, Freelance, Aluguel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição
                  </label>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingIncome?.description}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Valor Mensal *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      step="0.01"
                      defaultValue={editingIncome?.amount}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dia do Recebimento *
                    </label>
                    <input
                      type="number"
                      name="receiptDay"
                      min="1"
                      max="31"
                      defaultValue={editingIncome?.receiptDay}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                      defaultValue={editingIncome?.categoryId}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Selecione...</option>
                      {categories.filter(c => c.type === 'income').map(category => (
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
                      defaultValue={editingIncome?.owner}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
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
                      name="isIndefinite"
                      defaultChecked={editingIncome?.isIndefinite ?? true}
                      className="rounded"
                      id="isIndefinite"
                      onChange={(e) => {
                        const endDateField = document.getElementById('endDateField')
                        if (endDateField) {
                          endDateField.style.display = e.target.checked ? 'none' : 'block'
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Receita por tempo indeterminado
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data de Início *
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      defaultValue={editingIncome?.startDate ? format(editingIncome.startDate, 'yyyy-MM-dd') : ''}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div id="endDateField" style={{ display: editingIncome?.isIndefinite ? 'none' : 'block' }}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      defaultValue={editingIncome?.endDate ? format(editingIncome.endDate, 'yyyy-MM-dd') : ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={editingIncome?.notes}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingIncome(null)
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingIncome ? 'Salvar' : 'Criar'}
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
