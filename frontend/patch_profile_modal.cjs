const fs = require('fs');

const path = 'src/ProfileModal.tsx';
let content = fs.readFileSync(path, 'utf-8');

// Import useBilling
if (!content.includes('import { useBilling }')) {
  content = content.replace(
    "import { useUser } from './hooks/useUser';",
    "import { useUser } from './hooks/useUser';\nimport { useBilling } from './hooks/useBilling';\nimport { PRICING_CATALOG } from './config/pricing';"
  );
}

// Add billing hook inside component
if (!content.includes('const { balance, transactions }')) {
  content = content.replace(
    'const [message, setMessage] = useState',
    'const { balance, transactions, loading: billingLoading } = useBilling();\n  const [message, setMessage] = useState'
  );
}

// Add the rendering for the Plans tab
const plansContent = `
          {activeTab === 'Plans' && (
            <div className="pm-profile-body">
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', margin: '0 0 8px 0', color: '#fff' }}>Current Balance</h3>
                <div style={{ fontSize: '36px', fontWeight: '700', color: '#00FF7F' }}>
                  {billingLoading ? '...' : balance.toLocaleString()} <span style={{fontSize: '16px', color: '#999', fontWeight: '400'}}>Credits</span>
                </div>
                <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
                  Credits are used to run AI nodes. You are currently on the Free tier.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button className="pm-save-btn" style={{ flex: 'none', width: 'auto' }}>Upgrade Plan</button>
                  <button className="pm-edit-btn" style={{ flex: 'none', width: 'auto' }}>Buy Credits</button>
                </div>
              </div>

              <div className="pm-divider"></div>

              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#fff' }}>Pricing Catalog</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.values(PRICING_CATALOG).map(item => (
                  <div key={item.id} style={{ background: '#111', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#999', margin: '4px 0 8px 0' }}>{item.category.toUpperCase()}</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#00FF7F' }}>{item.baseCost} cr</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Usage' && (
            <div className="pm-profile-body">
              <h3 style={{ fontSize: '16px', margin: '0 0 16px 0', color: '#fff' }}>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px' }}>No recent transactions.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#999' }}>
                      <th style={{ padding: '8px' }}>Date</th>
                      <th style={{ padding: '8px' }}>Description</th>
                      <th style={{ padding: '8px' }}>Type</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => {
                       const date = typeof tx.createdAt === 'string' ? new Date(tx.createdAt) : tx.createdAt?.toDate?.() || new Date();
                       return (
                      <tr key={tx.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px 8px', color: '#ccc' }}>{date.toLocaleDateString()}</td>
                        <td style={{ padding: '12px 8px', color: '#fff' }}>{tx.description}</td>
                        <td style={{ padding: '12px 8px', color: '#999' }}>{tx.type}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600', color: tx.amount > 0 ? '#00FF7F' : '#E0E0E0' }}>
                          {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              )}
            </div>
          )}
`;

content = content.replace(
  "{activeTab !== 'Profile' && activeTab !== 'Account' && activeTab !== 'Preferences' && activeTab !== 'Settings' && (",
  plansContent + "\n\n          {activeTab !== 'Profile' && activeTab !== 'Account' && activeTab !== 'Preferences' && activeTab !== 'Settings' && activeTab !== 'Plans' && activeTab !== 'Usage' && ("
);

fs.writeFileSync(path, content, 'utf-8');
console.log('Patched ProfileModal.tsx');
