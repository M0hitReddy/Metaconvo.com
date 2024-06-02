import { ComponentProps } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
// import { Mail } from "@/app/(app)/examples/mail/data"
// import { useChat } from "@/components/dashboard/use-chat.js"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChats } from "./ChatsContext"
import axios from "axios"

export function MailList({ items }) {
  // const [chat, setChat] = useChat()
  const { state, dispatch } = useChats();
  // React.useEffect(() => {
  //   console.log('chats')
  //   dispatch({ type: 'SET_CHATS', payload: mails });
  // }, []);
  const handleChatSelect = async (id) => {
    dispatch({ type: 'SELECT_CHAT', payload: id })
    // async function settMessages() {
    //   try {
    //     const res = await axios.get('http://localhost:5000/chats/messages/' + id);
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // dispatch({type: 'READ_CHAT', payload: id})
    // setChat({
    //   ...chat,
    //   selected: id,
    // })
  }
  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              state.selectedChat === item.id && "bg-muted"
            )}
            onClick={() => handleChatSelect(item.id)
              // dispatch({type: 'SELECT_CHAT', payload: item.id})
              // dispatch({type: 'READ_CHAT', payload: item.id})
              // setChat({
              //   ...chat,
              //   selected: item.id,
              // })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    state.selectedChat === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(label) {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
