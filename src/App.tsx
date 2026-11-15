import { Route, Switch } from "wouter";
import Home from "@/pages/Home";
import Investments from "@/pages/Investments";
import CreateWallet from "@/pages/wallet/CreateWallet";
import RecoverWallet from "@/pages/wallet/RecoverWallet";
import { LocaleSync } from "@/components/locale-sync";

function App() {
  return (
    <>
       <LocaleSync />
       <Switch>
         <Route path="/" component={Home} />
         <Route path="/investments" component={Investments} />
         <Route path="/investimentos" component={Investments} />
         <Route path="/create" component={CreateWallet} />
         <Route path="/recover" component={RecoverWallet} />
         <Route>404</Route>
       </Switch>
    </>
  );
}
export default App;
