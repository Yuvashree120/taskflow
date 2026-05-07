import { NavLink } from 'react-router-dom'

const modules = [
  { label: 'Dashboard', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Team', path: '/team' },
  { label: 'Profile', path: '/profile' },
  
]

const user = {
  name: 'Ameer Khan',
  role: 'Product Designer',
}

function SideNav({ onLogout }) {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <aside className="w-80 min-h-screen flex-col rounded-[36px] bg-slate-950 px-6 py-8 text-slate-100 shadow-2xl shadow-slate-300/10">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Taskflow</h1>
      </div>

      <div className="mb-10">
        <p className="mb-4 text-xs uppercase tracking-[0.26em] text-slate-500">Modules</p>
        <ul className="space-y-2">
          {modules.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto rounded-[28px] bg-slate-900/80 px-4 py-5 shadow-inner shadow-slate-950/20">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-700 text-lg font-semibold text-white">
          {initials}
        </div>
        <p className="text-sm font-semibold text-white">{user.name}</p>
        <p className="text-xs text-slate-400">{user.role}</p>
        <button
          onClick={onLogout}
          className="mt-4 w-full rounded-3xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default SideNav
