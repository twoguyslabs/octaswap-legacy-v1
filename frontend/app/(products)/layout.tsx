import ProductsNavbar from './components/ProductsNavbar'

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductsNavbar />
      {children}
    </>
  )
}
