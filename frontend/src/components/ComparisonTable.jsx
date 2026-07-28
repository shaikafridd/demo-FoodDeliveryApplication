import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const COMPARISON_ROWS = [
  { feature: "Commission", deliveryApp: "25–30%", menuLink: "₹0", good: true },
  { feature: "Payout Time", deliveryApp: "7–15 Days", menuLink: "Instant", good: true },
  { feature: "Own Customer Relationship", deliveryApp: "No", menuLink: "Yes", good: true },
  { feature: "UPI Direct Payment", deliveryApp: "No", menuLink: "Yes", good: true },
];

export default function ComparisonTable() {
  return (
    <section className="wrap compare" id="compare">
      <div className="compare-top">
        <div>
          <h2>Why lose 30% every order?</h2>
          <p>Compare and see how much more you keep with MenuLink.</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Delivery Apps</th>
              <th>MenuLink</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, idx) => (
              <tr key={idx}>
                <td>{row.feature}</td>
                <td className="bad">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <XCircle size={15} /> {row.deliveryApp}
                  </span>
                </td>
                <td className="good">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} /> {row.menuLink}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
