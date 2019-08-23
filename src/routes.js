import Home from './Home'
import Home2 from './Home2'
import NotFound from './NotFound'

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
