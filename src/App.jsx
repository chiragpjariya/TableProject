import { lazy, Suspense } from "react"
import Loading from "./Component/Loading"

const Tables = lazy(() => import('./Component/Table'))

function App() {


  return (
    <>
      <div className="h-screen w-full">
        <Suspense fallback={<Loading />}>
          <Tables />
        </Suspense>
      </div>


    </>
  )
}

export default App
