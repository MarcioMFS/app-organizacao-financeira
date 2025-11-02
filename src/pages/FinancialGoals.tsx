import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, TrendingUp, Target } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useFinancialStore } from '../store/financialStore'
import { FinancialGoal } from '../types'
import { format } from 'date-fns'

export default function FinancialGoals() {
  const { user, couple } = useAuthStore()
  const { financialGoals, fetchFinancialGoals, addFinancialGoal, updateFinancialGoal, deleteFinancialGoal, addGoalTransaction } = useFinancialStore()
  const [showModal, setShowModal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null)
  const [showDepositModal, setShowDepositModal] = useState<FinancialGoal | null>(null)

  useEffect(() => {
    if (couple?.id) {
      fetchFinancialGoals(couple.id)
    }
  }, [couple?.id, fetchFinancialGoals])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!couple?.id || !user?.id) return

    const formData = new FormData(e.currentTarget)

    const goalData: any = {
      coupleId: couple.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      currentAmount: parseFloat(formData.get('currentAmount') as string) || 0,
      timeFrame: formData.get('timeFrame') as any,
      startDate: new Date(formData.get('startDate') as string),
      targetDate: formData.get('targetDate') ? new Date(formData.get('targetDate') as string) : undefined,
      priority: formData.get('priority') as any,
      category: formData.get('category') as string || undefined,
      icon: formData.get('icon') as string || '🎯',
      isCompleted: false,
      isActive: true,
      createdBy: user.id,
    }

    try {
      if (editingGoal) {
        await updateFinancialGoal(editingGoal.id, goalData)
      } else {
        await addFinancialGoal(goalData)
      }

      setShowModal(false)
      setEditingGoal(null)

      setTimeout(() => {
        alert(editingGoal ? 'Meta atualizada com sucesso!' : 'Meta criada com sucesso!')
      }, 100)
    } catch (error: any) {
      console.error('Error saving goal:', error)
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error)
      alert(`Erro ao salvar meta: ${errorMessage}`)
    }
  }

  const handleDeposit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!showDepositModal || !user?.id) return

    const formData = new FormData(e.currentTarget)

    try {
      await addGoalTransaction({
        goalId: showDepositModal.id,
        amount: parseFloat(formData.get('amount') as string),
        type: formData.get('type') as 'deposit' | 'withdrawal',
        description: formData.get('description') as string,
        date: new Date(formData.get('date') as string),
        createdBy: user.id,
      })

      setShowDepositModal(null)

      setTimeout(() => {
        alert('Movimentação registrada com sucesso!')
      }, 100)
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      const errorMessage = error?.message || error?.error_description || JSON.stringify(error)
      alert(`Erro ao registrar movimentação: ${errorMessage}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Deseja realmente excluir esta meta?')) {
      try {
        await deleteFinancialGoal(id)
      } catch (error) {
        alert('Erro ao excluir meta')
      }
    }
  }

  const activeGoals = financialGoals.filter(g => g.isActive && !g.isCompleted)
  const byTimeFrame = {
    short: activeGoals.filter(g => g.timeFrame === 'short'),
    medium: activeGoals.filter(g => g.timeFrame === 'medium'),
    long: activeGoals.filter(g => g.timeFrame === 'long'),
  }

  const timeFrameLabels = {
    short: { label: 'Curto Prazo', subtitle: 'Até 6 meses', color: 'bg-blue-500' },
    medium: { label: 'Médio Prazo', subtitle: '6-24 meses', color: 'bg-yellow-500' },
    long: { label: 'Longo Prazo', subtitle: '+24 meses', color: 'bg-purple-500' },
  }

  const getProgress = (goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  const renderGoalCard = (goal: FinancialGoal) => (
    <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4"
      style={{ borderLeftColor: goal.priority === 'high' ? '#EF4444' : goal.priority === 'medium' ? '#F59E0B' : '#10B981' }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{goal.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{goal.name}</h3>
            {goal.category && <span className="text-sm text-gray-500">{goal.category}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDepositModal(goal)} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </button>
          <button onClick={() => { setEditingGoal(goal); setShowModal(true) }} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(goal.id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progresso</span>
          <span className="font-semibold text-gray-900 dark:text-white">{getProgress(goal).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${getProgress(goal)}%` }} />
        </div>
        <div className="flex justify-between text-sm mt-3">
          <span className="text-gray-600 dark:text-gray-400">
            {goal.currentAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {goal.targetAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        {goal.targetDate && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Meta: {format(goal.targetDate, 'dd/MM/yyyy')}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas Financeiras</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Defina e acompanhe seus objetivos</p>
        </div>
        <button onClick={() => { setEditingGoal(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <Plus className="w-5 h-5" />
          Nova Meta
        </button>
      </div>

      {Object.entries(byTimeFrame).map(([key, goals]) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-1 h-8 ${timeFrameLabels[key as keyof typeof timeFrameLabels].color} rounded`} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {timeFrameLabels[key as keyof typeof timeFrameLabels].label}
              </h2>
              <p className="text-sm text-gray-500">{timeFrameLabels[key as keyof typeof timeFrameLabels].subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {goals.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 col-span-2 text-center py-8">Nenhuma meta cadastrada</p>
            ) : (
              goals.map(renderGoalCard)
            )}
          </div>
        </div>
      ))}

      {/* Modal Nova/Editar Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
                    <input type="text" name="name" defaultValue={editingGoal?.name} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ícone</label>
                    <input type="text" name="icon" defaultValue={editingGoal?.icon || '🎯'} maxLength={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea name="description" rows={2} defaultValue={editingGoal?.description}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Meta *</label>
                    <input type="number" name="targetAmount" step="0.01" defaultValue={editingGoal?.targetAmount} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor Atual</label>
                    <input type="number" name="currentAmount" step="0.01" defaultValue={editingGoal?.currentAmount || 0}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
                    <input type="text" name="category" defaultValue={editingGoal?.category} placeholder="Ex: Viagem, Carro"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prazo *</label>
                    <select name="timeFrame" defaultValue={editingGoal?.timeFrame} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                      <option value="short">Curto Prazo (até 6 meses)</option>
                      <option value="medium">Médio Prazo (6-24 meses)</option>
                      <option value="long">Longo Prazo (+24 meses)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade *</label>
                    <select name="priority" defaultValue={editingGoal?.priority || 'medium'} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white">
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Início *</label>
                    <input type="date" name="startDate" defaultValue={editingGoal?.startDate ? format(editingGoal.startDate, 'yyyy-MM-dd') : ''} required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Meta</label>
                    <input type="date" name="targetDate" defaultValue={editingGoal?.targetDate ? format(editingGoal.targetDate, 'yyyy-MM-dd') : ''}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button type="button" onClick={() => { setShowModal(false); setEditingGoal(null) }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    {editingGoal ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Valor */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Movimentar: {showDepositModal.name}
              </h2>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo *</label>
                  <select name="type" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option value="deposit">Depósito</option>
                    <option value="withdrawal">Retirada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valor *</label>
                  <input type="number" name="amount" step="0.01" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição *</label>
                  <input type="text" name="description" required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data *</label>
                  <input type="date" name="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button type="button" onClick={() => setShowDepositModal(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirmar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
