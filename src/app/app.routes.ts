import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import { Payments } from './pages/payments/payments';
import {TransferByAccount} from './pages/transfer/transfer-by-account/transfer-by-account';
import {TransferByUsername} from './pages/transfer/transfer-by-username/transfer-by-username';
import {TransferBetweenAccounts} from './pages/transfer/transfer-between-accounts/transfer-between-accounts';
import {RequestWithdraw} from './pages/request/request-withdraw/request-withdraw';
import {RequestDeposit} from './pages/request/request-deposit/request-deposit';
import {TransactionHistory} from './pages/transaction-history/transaction-history';
import {RegisterBusiness} from './pages/business/register-business/register-business';
import {SuccessBusiness} from './pages/business/success-business/success-business';
import {InfoBusiness} from './pages/business/info-business/info-business';
import {TransferInfo} from './pages/transfer/transfer-info/transfer-info';
import {InternalTransferSuccess} from './pages/transfer/internal-transfer-success/internal-transfer-success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'payments', component: Payments },
  { path: 'history', component: TransactionHistory },
  { path: 'transfer/by-username', component: TransferByUsername },
  { path: 'transfer/by-account', component: TransferByAccount },
  { path: 'transfer/between-accounts', component: TransferBetweenAccounts },
  { path: 'request/withdraw', component: RequestWithdraw },
  { path: 'request/deposit', component: RequestDeposit },
  { path: 'business/register-business', component: RegisterBusiness },
  { path: 'business/success-business', component: SuccessBusiness },
  { path: 'business/info-business', component: InfoBusiness },
  { path: 'transfer/pending-transfer', component: TransferInfo },
  { path: 'transfer/internal-transfer-success', component: InternalTransferSuccess },
];
