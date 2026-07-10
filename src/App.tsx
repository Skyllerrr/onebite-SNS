import ModalProvider from "./provider/modal-provider";
import SessionProvider from "./provider/session-provider";
import RootRoute from "./root-route";

// 세션을 관리하는 모든 로직이 들어있는 session-provider 폴더에서 
// SessionProvider 컴포넌트를 불러옴
export default function App() {
  return (
    <SessionProvider>
      <ModalProvider>
        <RootRoute />
      </ModalProvider>
    </SessionProvider>
  );
}
