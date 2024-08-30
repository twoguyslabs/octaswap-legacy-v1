'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Overview from './components/Overview'
import Stake from './components/Stake'
import Withdraw from './components/Withdraw'

export default function Staking() {
  return (
    <main>
      <div className='px-3 pb-5 sm:mx-auto sm:max-w-xl sm:px-0 sm:pt-10'>
        <Tabs defaultValue='overview'>
          <TabsList className='grid grid-cols-3'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='stake'>Stake</TabsTrigger>
            <TabsTrigger value='withdraw'>Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>
            <Overview />
          </TabsContent>
          <TabsContent value='stake'>
            <Stake />
          </TabsContent>
          <TabsContent value='withdraw'>
            <Withdraw />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
