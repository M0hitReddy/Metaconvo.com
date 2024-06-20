import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"


import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useChats } from "./ChatsContext"
import { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContext"
import { set } from "date-fns"
// import { chat } from "@/components/dashboard/data"
import { useParams } from "react-router-dom"
import { Archive, ArchiveX, Trash2, Trash, Clock, Reply, ReplyAll, Forward, MoreVertical, } from "lucide-react"


export function ChatDisplay() {
  const { user } = useContext(AuthContext);
  const { chatid } = useParams();
  // const[chat, setChat] = useState(null);
  console.log(chatid)
  // console.log(user);
  const { state, dispatch } = useChats();
  const messagesEndRef = useRef(null);
  // console.log(state)
  const [message, setMessage] = useState('');
  const today = new Date()
  useEffect(() => {
    if(!chatid || !user.id) return;
    // console.log(state.chats);
    // const chatt = state.chats.find((item) => item.conversationID === Number(chatid)) || null;
    // console.log(chatt);
    // setChat(chatt);
    (async () => {
      try {
        // console.log("2 times/////////////@@##$%")
        const res = await axios.get(`http://localhost:5000/chats/conversation?conversationId=${chatid}&userId=${user.id}`);
        console.log(res.data)
        // dispatch({ type: 'SET_MESSAGES', payload: res.data });
        dispatch({ type: 'SELECT_CHAT', payload: res.data[0] });
      } catch (error) {
        console.error(error)
      }
    })();
  }, [state.chats, chatid]);
  useEffect(() => {
    // console.log(user.id, "user")
    // console.log(state.messages)
    if (state.messages[state.messages.length - 1]?.SenderID === user.id)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [state.messages]);
  useEffect(() => {
    if (!state.socket) return;
    state.socket.on('receive-message', (data) => {
      console.log(data);
      // console.log(state.messages + 'messages');
      state.socket.emit('message-received', data);
      if (data.sender !== data.receiver) {
        state.socket.emit('message-received', data);
        // console.log(data.sender + state.selectedChat.userId)
        dispatch({ type: 'ADD_MESSAGE', payload: data.message });
      }
    }
    )
  }, [state.socket]);
  // useEffect(() => { 
  //   if(!chatid) return;
  //   // if(!state.selectedChat) {

  //   // }
  //   dispatch({type: 'SELECT_CHAT', payload: {conversationID: chatid, userID: chatt.userID}});
  //   console.log(state.selectedChat); 
  // }, [chat])

  useEffect(() => {
    if (!state.selectedChat) return;
    // console.log('fetching messages')
    (async () => {
      try {
        // console.log("2 times/////////////@@##$%")
        const res = await axios.get(`http://localhost:5000/chats/messages?conversationID=${state.selectedChat.conversationID}`);
        console.log(res.data)
        dispatch({ type: 'SET_MESSAGES', payload: res.data });
      } catch (error) {
        console.error(error)
      }
    })();

  }, [state.selectedChat]);
  // console.log(user)
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!message.trim()) return;
    // console.log(state.messages)
    // state.messages.map((message) => console.log(message))
    try {
      const newMessage = {
        SenderID: user.id,
        id: new Date() + Math.random() * 1000,
        content: message,
        conversationID: state.selectedChat.conversationID,
        timestamp: formatDate(new Date()),
        readstatus: 0
      }
      console.log(newMessage)
      console.log(formatDate(new Date()),);
      setMessage('');
      // dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      // const res = await axios.post('http://localhost:5000/chats/message', newMessage)
      console.log(res.data)
      state.socket.emit('send-message', { sender: user.id, receiver: state.selectedChat.userID, message: newMessage });
      // console.log('set message')
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      console.error(err)
    }
  }
  const getTime = (time) => {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;

    return formattedTime;
  }
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    const hours = (`0${d.getHours()}`).slice(-2);
    const minutes = (`0${d.getMinutes()}`).slice(-2);
    const seconds = (`0${d.getSeconds()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  // state.messages.map((message) => console.log(message))

  return (
    <>
      {/* <div className="flex h- flex-col"> */}
      {/* <div> */}
      {/* <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
              <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
          <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
              </TooltipTrigger>
              <TooltipContent>Move to junk</TooltipContent>
              </Tooltip>
              <Tooltip>
              <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
              </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
          <Popover>
          <PopoverTrigger asChild>
          <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
          <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                    </Button>
                </TooltipTrigger>
                </PopoverTrigger>
                <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                    variant="ghost"
                      className="justify-start font-normal"
                      >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                      {format(addHours(today, 4), "E, h:m b")}
                      </span>
                      </Button>
                      <Button
                      variant="ghost"
                      className="justify-start font-normal"
                      >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 1), "E, h:m b")}
                        </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                    This weekend
                    <span className="ml-auto text-muted-foreground">
                        {format(nextSaturday(today), "E, h:m b")}
                      </span>
                      </Button>
                    <Button
                    variant="ghost"
                      className="justify-start font-normal"
                    >
                    Next week
                    <span className="ml-auto text-muted-foreground">
                        {format(addDays(today, 7), "E, h:m b")}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                <Calendar />
                </div>
                </PopoverContent>
                </Popover>
                <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
        <Tooltip>
            <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
              </Tooltip>
              <Tooltip>
              <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
              <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
                </Button>
                </TooltipTrigger>
                <TooltipContent>Reply all</TooltipContent>
                </Tooltip>
                <Tooltip>
                <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
                </Button>
                </TooltipTrigger>
                <TooltipContent>Forward</TooltipContent>
                </Tooltip>
                </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={!state.selectedChat}>
        <MoreVertical className="h-4 w-4" />
        <span className="sr-only">More</span>
        </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem>Star thread</DropdownMenuItem>
          <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <Separator /> */}
      {state.selectedChat ? (
        <div className="h-screen overflow-y- relative flex flex-grow flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={state.selectedChat.username} />
                <AvatarFallback>
                  {state.selectedChat?.username
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold ">{state.selectedChat.username}</div>
                {/* <div className="line-clamp-1 text-xs">{state.selectedChat.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {state.selectedChat.echat}
                  </div> */}
              </div>
            </div>
            {state.selectedChat.timestamp && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(state.selectedChat.timestamp), "MMM d, yyyy, h:mm a")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-grow"></div>
          <ScrollArea className='h-scree flex flex-col h- justify-end '>
            <div className="flex flex-col flex-grow overflow-y-auto justify-end gap-3   whitespace-pre-wrap p-4 text-sm">
              {/* <div className="flex-grow"/> */}
              {
                state.messages.map((message) => (
                  <div key={message.id} className={`${(user.id === message.SenderID) ? 'self-end border border-primary rounded-tr-none' : 'self-start shadow-lg bg-secondary rounded-tl-none'} relative text-left min-w-16 max-w-full sm:max-w-[90%] md:max-w-[70%] break-words flex justify-end gap-2 w-auto px-2 py-1 rounded-xl `}>
                    {/* <div className="flex"> */}
                    <p className={`text-primary${(user.id === message.SenderID) ? '-background' : '-background'} text-md font-medium leading-7 h-max pe-12`}>{message.content}</p>
                    {/* <p className="pe-14 h-1"></p> */}
                    {/* </div> */}
                    <p className="absolute top-1 right-2 w-max  text-gray-400 text-[10px] leading-3 self-end ">{getTime(message.timestamp)}</p>
                  </div>
                ))

              }
              <div ref={messagesEndRef} />
            </div>
            <ScrollBar />
          </ScrollArea>
          <Separator className="mt-auto" />
          <div className="p-4 bottom-0 left-0 right-0 z-10 bg-background ">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Reply ${state.selectedChat.username}...`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    disabled={message.trim() === ''}
                    onClick={(e) => handleSendMessage(e)}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (''
        // <div className="p-8 text-center text-muted-foreground">
        //   No message selected
        // </div>
      )}
      {/* </div> */}
      {/* </div> */}
    </>
  )
}
