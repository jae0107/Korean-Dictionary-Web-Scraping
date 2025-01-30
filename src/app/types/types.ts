export interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export interface SearchResult {
  title: string;
  koDic: string[];
  naverDic: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Word {
  id: string;
  title: string;
  korDicResults: string[];
  naverDicResults: string[];
  requestor: User;
  status: 'PENDING' | 'APPROVED' | 'DENIED';
  createdAt: Date;
}