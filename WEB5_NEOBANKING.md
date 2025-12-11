# Web5 OmniNeoBanking Feature

## Overview

The Web5 OmniNeoBanking feature brings decentralized banking capabilities to CarbonX, combining Web5 technology, blockchain, and AI agents to provide a complete digital banking experience.

## Features

### 🆔 Decentralized Identity (DID)
- **Web5 Integration**: Uses TBD's Web5 SDK for decentralized identity management
- **Self-Sovereign Identity**: Users own and control their banking identity
- **DWN Storage**: Decentralized Web Nodes for secure data storage
- **Privacy-First**: No centralized identity database

### 💳 Virtual Card Issuing
- **Debit Cards**: Instant debit card issuance with account linking
- **Credit Cards**: Credit card issuance with configurable limits
- **Card Management**: Full card details including number, CVV, expiry date
- **Card Status**: Active, frozen, or cancelled states
- **Beautiful UI**: Gradient card designs matching card type

### 🤖 AI Payment Agent
- **Smart Approvals**: AI-powered payment authorization
- **Configurable Limits**: Set maximum amounts for auto-approval
- **Category Filtering**: Restrict payments to specific categories
- **Security**: Additional validation layer for large transactions
- **Real-time Monitoring**: Track AI agent activity

### 💰 Banking Operations
- **Deposits**: Add funds from multiple sources (bank transfer, card, crypto)
- **Payments**: Send payments to other DID holders
- **Withdrawals**: Withdraw to external accounts
- **Balance Management**: Real-time account balance tracking
- **Transaction History**: Complete audit trail of all operations

### 📊 Transaction Management
- **Real-time Updates**: Instant transaction recording
- **Status Tracking**: Pending, completed, failed, or cancelled states
- **Rich Metadata**: Detailed transaction information
- **Visual Indicators**: Color-coded transaction types
- **Export Ready**: Structured data for reporting

## Technology Stack

### Dependencies
```json
{
  "@web5/api": "Latest - Core Web5 functionality",
  "@web5/dids": "Latest - Decentralized identifier management",
  "@web5/credentials": "Latest - Verifiable credentials"
}
```

### Key Technologies
- **Web5 SDK**: TBD's decentralized web platform
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Modern styling
- **Local Storage**: Fallback data persistence

## File Structure

```
src/
├── app/
│   └── neobanking/
│       └── page.tsx              # Main neobanking UI
├── lib/
│   ├── web5-config.ts            # Web5 initialization
│   └── neobanking-service.ts     # Banking business logic
└── types/
    └── neobanking.ts             # TypeScript type definitions
```

## Usage

### Accessing the Platform

Navigate to `/neobanking` to access the Web5 OmniNeoBanking interface.

### First Time Setup

1. **Initialize Web5**: The platform automatically creates a DID on first visit
2. **Account Creation**: A banking account is created with your DID
3. **Starting Balance**: Demo accounts start with $1,000 USD

### Issuing a Virtual Card

```typescript
// Click "New Card" button
// Fill in the form:
{
  type: 'debit' | 'credit',
  cardholderName: 'Your Name',
  creditLimit: 5000 // For credit cards only
}
```

### Making a Payment

```typescript
// Click "Pay" button
// Fill in the form:
{
  amount: 100.00,
  recipient: 'did:dht:...',
  description: 'Payment for services'
}
```

### Depositing Funds

```typescript
// Click "Deposit" button
// Fill in the form:
{
  amount: 500.00,
  source: 'Bank Transfer' | 'Credit Card' | 'Crypto Wallet' | 'Wire Transfer'
}
```

## Architecture

### Web5 Layer
```
User → Web5 SDK → DWN (Decentralized Web Node) → Local Storage (Fallback)
```

### Data Flow
1. **Initialization**: Web5.connect() creates or loads DID
2. **Storage**: Records stored in DWN with protocol definitions
3. **Fallback**: Local storage used when DWN unavailable
4. **Sync**: Data syncs across user's devices via Web5 network

### Security Model
- **Self-Custody**: Users control their own keys
- **Encrypted Storage**: DWN data encrypted at rest
- **No Central Server**: No single point of failure
- **AI Guards**: Secondary validation for transactions

## API Reference

### Web5 Configuration

```typescript
// Initialize Web5
const { web5, did } = await initializeWeb5();

// Check status
const isInitialized = isWeb5Initialized();

// Get current DID
const userDid = getUserDid();
```

### Banking Operations

```typescript
// Initialize account
const account = await initializeBankingAccount();

// Issue card
const card = await issueVirtualCard({
  type: 'debit',
  cardholderName: 'John Doe',
  creditLimit: 5000
});

// Process payment
const transaction = await processPayment(
  {
    amount: 100,
    currency: 'USD',
    recipient: 'did:dht:...',
    description: 'Payment'
  },
  aiAgent
);

// Deposit funds
const deposit = await depositFunds(500, 'Bank Transfer');

// Withdraw funds
const withdrawal = await withdrawFunds(200, 'External Account');
```

### Data Loading

```typescript
// Load account
const account = await loadBankAccount();

// Load cards
const cards = await loadVirtualCards();

// Load transactions
const transactions = await loadTransactions();
```

## Integration with CarbonX

### Navigation
- Added to main MegaMenu as featured tile
- Listed in "Explore more" section
- Accessible from `/neobanking` route

### Design Consistency
- Matches CarbonX dark theme
- Uses existing color palette (emerald, cyan, purple)
- Follows established UI patterns
- Responsive design for all devices

### Future Enhancements
- Integration with carbon credit purchases
- Green investment products
- Sustainability rewards on cards
- Carbon offset for transactions
- Multi-currency support
- Crypto wallet integration

## Development

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access at http://localhost:3000/neobanking
```

### Testing
```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Environment Variables
No additional environment variables required. Web5 SDK works out of the box.

## Troubleshooting

### Web5 Not Initializing
- Check browser console for errors
- Ensure browser supports IndexedDB
- Clear local storage and retry

### Transactions Not Persisting
- Check if local storage is enabled
- Verify browser storage quota
- Try clearing cache and reloading

### Cards Not Displaying
- Refresh the page
- Check local storage data
- Verify card creation completed

## Security Considerations

### Best Practices
1. **Never Share DIDs Publicly**: DIDs are like account numbers
2. **Use AI Agent Limits**: Set appropriate transaction limits
3. **Review Transactions**: Regularly check transaction history
4. **Backup Keys**: Web5 keys are stored locally, backup important

### Known Limitations
- Demo mode: Real banking not connected
- Local storage: Data lost if browser storage cleared
- No real money: Educational/demonstration purposes only
- Network sync: DWN sync depends on Web5 network availability

## Contributing

Contributions welcome! Please:
1. Follow existing code style
2. Add TypeScript types for new features
3. Update documentation
4. Test on multiple browsers
5. Submit PR with clear description

## License

Same as CarbonX project (MIT License)

## Support

For issues or questions:
- Open GitHub issue
- Check CarbonX documentation
- Visit TBD developer site for Web5 questions

## Resources

- [Web5 Documentation](https://developer.tbd.website/docs/)
- [Web5 SDK](https://github.com/TBD54566975/web5-js)
- [Decentralized Identifiers](https://www.w3.org/TR/did-core/)
- [CarbonX Repository](https://github.com/michaelbjordanz/CarbonX)

---

**Built with ❤️ using Web5, AI, and Blockchain Technology**
