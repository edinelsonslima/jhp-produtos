import { Title } from '@/components/_layout/title'
import { Card } from '@/components/_ui/card'
import { toast } from '@/components/_ui/toast'
import { Stat } from '@/components/dashboard/stat'
import { SaleItem } from '@/components/sales/item'
import { authStore } from '@/hooks/useAuth'
import { paymentStore } from '@/hooks/usePayments'
import { saleStore } from '@/hooks/useSales'
import { cn } from '@/lib/utils'
import { Banknote, DollarSign, Minus, Smartphone, TrendingDown, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const user = authStore.useStore((state) => state.user)

  const todaySales = saleStore.useStore((state) => state.today)
  const monthSales = saleStore.useStore((state) => state.month)

  const todayPayments = paymentStore.useStore((state) => state.today)
  const monthPayments = paymentStore.useStore((state) => state.month)

  const todayNet = todaySales.total - todayPayments.total

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return 'Bom dia'
    }

    if (hour < 18) {
      return 'Boa tarde'
    }

    return 'Boa noite'
  }

  const handleDelete = (id: string) => {
    saleStore.action.delete(id)
    toast.success('Venda excluída')
  }

  return (
    <>
      <Title
        title={`${getGreeting()}, ${user?.name?.split(' ')[0] ?? ''}!`}
        subtitle={`Resumo do dia ${new Date().toLocaleDateString('pt-BR')}`}
      />

      <Card appearance='ghost'>
        <Card.Title>HOJE</Card.Title>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <Stat title='Total Vendido' value={todaySales.total} icon={{ element: DollarSign, variant: 'primary' }} />

          <Stat
            title='Pix'
            variant='success'
            value={todaySales.pix}
            icon={{ element: Smartphone, variant: 'success' }}
          />

          <Stat
            title='Dinheiro'
            variant='warning'
            value={todaySales.cash}
            icon={{ element: Banknote, variant: 'warning' }}
          />

          <Stat
            title='Diárias Pagas'
            variant='error'
            value={todayPayments.total}
            icon={{ element: Minus, variant: 'error' }}
          />
        </div>
      </Card>

      <Stat
        title='Líquido Hoje'
        subtitle='Total vendido − diárias pagas'
        value={todayNet}
        icon={{
          element: todayNet >= 0 ? TrendingUp : TrendingDown,
          appearance: 'no-border',
        }}
        classNames={{
          icon: 'text-base-content/20 size-10',
          value: cn(
            'text-2xl sm:text-3xl font-extrabold mt-1 font-mono',
            todayNet >= 0 ? 'text-success' : 'text-error',
          ),
        }}
      />

      <Card appearance='ghost'>
        <Card.Title>ESTE MÊS</Card.Title>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <Stat title='Total Mês' value={monthSales.total} icon={{ element: DollarSign, variant: 'primary' }} />
          <Stat
            title='Pix no Mês'
            variant='success'
            value={monthSales.pix}
            icon={{ element: Smartphone, variant: 'success' }}
          />
          <Stat
            title='Dinheiro no Mês'
            variant='warning'
            value={monthSales.cash}
            icon={{ element: Banknote, variant: 'warning' }}
          />
          <Stat
            title='Diárias Pagas no Mês'
            variant='error'
            value={monthPayments.total}
            icon={{ element: Minus, variant: 'error' }}
          />
        </div>
      </Card>

      <Card appearance='ghost'>
        <Card.Title>VENDAS DE HOJE ({todaySales.saleId.length})</Card.Title>
        {todaySales.saleId.length === 0 ? (
          <Card className='p-8 text-center text-base-content/60 text-sm'>Nenhuma venda registrada hoje</Card>
        ) : (
          <div className='space-y-2'>
            {todaySales.saleId.slice(0, 10).map((saleId) => (
              <SaleItem key={saleId} saleId={saleId} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
