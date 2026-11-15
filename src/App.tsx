import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import Home from "@/pages/Home";
import Investments from "@/pages/Investments";
import CreateWallet from "@/pages/wallet/CreateWallet";
import RecoverWallet from "@/pages/wallet/RecoverWallet";
import { LocaleSync } from "@/components/locale-sync";

function App() {
  const [location] = useLocation();

  // Ao trocar de rota, volta ao topo: sem isso, a nova página herda a posição
  // de scroll da anterior e a navegação parece um "flick"/salto.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
