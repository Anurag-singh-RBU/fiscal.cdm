# Fiscal CDM

Fiscal.cdm is a calendar-based financial data visualization tool designed to analyze cryptocurrency market trends. It provides users with an intuitive interface to explore market performance , volatility , and other technical indicators over time. The tool supports multiple timeframes and allows PDF exports for reporting purposes.

---

## Features

- Interactive calendar view with selectable day , week , and month modes
- Cryptocurrency selector (BTC, ETH, SOL, ADA, DOT)
- Visual indicators for :
  - Daily performance (bullish/bearish/neutral)
  - Volatility level (color-coded)
  - Liquidity and trading volume
- Hover and click functionality for detailed data preview
- Side panel showing :
  - Open , close , high , low prices
  - Volume , liquidity , market cap
  - Technical indicators (RSI , MACD)
- PDF export functionality for the calendar view

---

## Tech Stack

### Frontend :
- **React** with **TypeScript**
- **Vite** (or Create React App , depending on setup)
- **Tailwind CSS** for UI styling

### Key Libraries :
- `date-fns` – Date manipulation and formatting
- `lucide-react` – Icons
- `html2canvas` – Convert DOM elements to image
- `jspdf` – PDF generation
- `classnames` (or `cn` util) – Dynamic class handling

---

## Getting Started – Run Locally

### Prerequisites
- Node.js (version 16 or higher recommended)
- npm , yarn , or bun package manager

### Steps

1. Clone the repository :
   ```bash
   git clone https://github.com/Anurag-singh-RBU/fiscalcdm.git
   cd fiscalcdm

2. Install Dependencies :
   ```bash
   npm install

3. Run the Server :
   ```bash
   npm run dev

---

Author : Anurag Singh

  

