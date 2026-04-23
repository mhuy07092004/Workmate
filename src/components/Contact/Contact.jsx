/**
 * Contact.jsx — Sticky sidebar contact list component
 *
 * Displays a list of contacts with avatar placeholders.
 * Positioned as a sticky sidebar that remains visible while main content scrolls.
 */

const CONTACTS = [
  { id: 1, name: 'Minh Huy Loi' },
  { id: 2, name: 'The Long Tran' },
  { id: 3, name: 'Tuong Vy Tran' },
  { id: 4, name: 'Hoang Thanh Truc Nguyen' },
  { id: 5, name: 'Donald Trump' },
  { id: 6, name: 'Elon Musk' },
  { id: 7, name: 'Tim Cook' },
]

function Contact() {
  return (
    <aside className="w-[240px] shrink-0">
      <div className="sticky top-4 bg-white rounded-[14px] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
        <h3 className="text-[1rem] font-semibold text-slate-900 mb-4">Contacts</h3>
        
        <ul className="space-y-3">
          {CONTACTS.map(contact => (
            <li key={contact.id} className="flex items-center gap-3 group cursor-pointer">
              {/* Avatar placeholder */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm">
                {contact.name.charAt(0)}
              </div>
              
              {/* Contact name */}
              <span className="text-[0.9rem] text-slate-700 group-hover:text-blue-600 transition-colors truncate">
                {contact.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Contact
