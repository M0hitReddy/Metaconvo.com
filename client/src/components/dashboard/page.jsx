// import { cookies } from "next/headers"
// import Image from "next/image"
import Cookies from 'universal-cookie';
import io from 'socket.io-client';

// ...

const cookies = new Cookies();
// const layout = cookies.get('react-resizable-panels:layout');

import { Chats } from "@/components/chats"
import { accounts, mails } from "@/components/dashboard/data"
import { ChatsProvider } from '../ChatsContext';
import { useMemo } from 'react';
export default function Dashboard() {
  const socket = useMemo(() => io('http://localhost:5000'), []);
  const layout = cookies.get("react-resizable-panels:layout")
  const collapsed = cookies.get("react-resizable-panels:collapsed")
  const defaultLayout = layout && layout.value ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed && collapsed.value ? JSON.parse(collapsed.value) : undefined;
  // socket.on('connect', () => {

  //   console.log('Connected to the server', socket.id);
  // });

  return (
    <>

      {/* <div className="hidden flex-col md:flex"> */}
      <ChatsProvider>
        <Chats
          socket={socket}
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </ChatsProvider>
      {/* </div> */}
    </>
  )
}
