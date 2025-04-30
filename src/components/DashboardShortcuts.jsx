import React from 'react';
import { Card } from 'react-bootstrap';
import {
  FaUsers,
  FaUserPlus,
  FaListAlt,
  FaPlusSquare,
  FaClipboardList,
  FaCartPlus,
  FaMoneyBillWave
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const shortcuts = [
  { title: 'Müşteri Ekle',      path: '/dashboard/addCustomer2', Icon: FaUserPlus       },
  { title: 'Teklif Listesi',    path: '/dashboard/listQuotes',    Icon: FaListAlt        },
  { title: 'Teklif Oluştur',    path: '/dashboard/addQuote',      Icon: FaPlusSquare     },
  { title: 'Sipariş Listesi',   path: '/dashboard/listOrder',     Icon: FaClipboardList  },
  { title: 'Sipariş Oluştur',   path: '/dashboard/addOrder',      Icon: FaCartPlus       },
  { title: 'Bakiyeleri Gör',    path: '/dashboard/listBalances',  Icon: FaMoneyBillWave }
];

export default function DashboardShortcuts() {
  // Eğer React Router kullanıyorsan:
  // const navigate = useNavigate();

  return (
    <div className="row g-3 mb-2">
    <h5 className="mb-0 mt-0">Kısayollar</h5>
      {shortcuts.map(({ title, path, Icon }) => (
        <div key={path} className="col-4 col-sm-4 col-md-4">
          <Card
            onClick={() => window.location.href = path}
            className="border-2 border-primary text-center h-100 shortcut-card"
            style={{ cursor: 'pointer' }}
          >
            <Card.Body className="d-flex flex-column justify-content-center align-items-center py-4">
              <Icon size={36} className="mb-3 text-primary" />
              <Card.Title className="fs-6">{title}</Card.Title>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
}
