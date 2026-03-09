import { Routes, Route, HashRouter, useSearchParams } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { useMemo } from 'react'
import { UnknownApplication } from './pages/UnknownApplication'

const fallbackRender = ({ error }) => {
  console.log('Something went wrong:', error)
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'red' }}>
      Something broke :((
      <br />
      {error}
    </div>
  )
}

const AppRoutes = () => {
  const [searchParams] = useSearchParams(window?.location.search)
  const path = useMemo(() => '/' + (searchParams.get('path') ?? ''), [searchParams])

  return (
    <Routes location={path}>
      <Route path="/*" element={<UnknownApplication path={path} />} />
    </Routes>
  )
}

const App = () => {
  return (
    <>
      <ErrorBoundary fallbackRender={fallbackRender}>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ErrorBoundary>
    </>
  )
}

export default App
