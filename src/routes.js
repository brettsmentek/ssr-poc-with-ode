import Home from './Home'
import Home2 from './Home2'
import NotFound from './NotFound'

// import loadData from './helpers/loadData'

const Routes = [
  {
    path: '/',
    exact: true,
    component: Home,
  },
  {
    path: '/2',
    component: Home2,
  },
  {
    component: NotFound,
  },
]

export default Routes
