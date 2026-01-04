import { mnemonicToPrivateKey } from '@ton/crypto';
import { WalletContractV4 } from '@ton/ton';

const mnemonic = "power snap scout pear sweet able this edit demand onion renew air nothing dawn various phone dove must struggle wedding eagle panda divide physical";

async function verifyWallet() {
  const key = await mnemonicToPrivateKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ workchain: 0, publicKey: key.publicKey });
  const address = wallet.address.toString();
  
  console.log('Derived wallet address:', address);
  console.log('Expected wallet address:', 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D');
  console.log('Match:', address === 'EQB0aFhoZIW4oKhg3Uq_KhG0KTxk_-p8dtKQDCIsPJ_okk3D');
}

verifyWallet();
