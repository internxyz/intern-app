interface Transaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  value: string;
}

interface TransactionResponse {
  status: string;
  message: string;
  result: Transaction[];
}

export class Routescan {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(apiKey: string, network: 'mainnet' | 'testnet' = 'mainnet', chainId: number) {
    this.apiKey = apiKey;
    this.baseUrl = `https://api.routescan.io/v2/network/${network}/evm/${chainId}/etherscan/api`;
  }

  async getTransactions(
    address: string,
    options: {
      startBlock?: number;
      endBlock?: number;
      page?: number;
      offset?: number;
      sort?: 'asc' | 'desc';
    } = {}
  ): Promise<TransactionResponse> {
    const {
      startBlock = 0,
      endBlock = 99999999,
      page = 1,
      offset = 10,
      sort = 'asc'
    } = options;

    const params = new URLSearchParams({
      module: 'account',
      action: 'txlist',
      address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: page.toString(),
      offset: offset.toString(),
      sort,
      apikey: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Routescan API error: ${response.statusText}`);
    }

    return response.json();
  }
}

export default Routescan;