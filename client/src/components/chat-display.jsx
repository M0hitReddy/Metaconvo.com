import addDays from "date-fns/addDays"
import addHours from "date-fns/addHours"
import format from "date-fns/format"
import nextSaturday from "date-fns/nextSaturday"
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react"

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
import { ScrollArea } from "./ui/scroll-area"
import { useChats } from "./ChatsContext"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import { AuthContext } from "./AuthContext"
// import { Mail } from "@/components/dashboard/data"


export function ChatDisplay({ mail }) {
  const { user } = useContext(AuthContext);
  const { state, dispatch } = useChats();

  // console.log(state)
  const [message, setMessage] = useState('');
  const today = new Date()
  useEffect(() => {
    if (!state.socket) return;
    // console.log(state.socket.on)
    // const socket = state.socket;
    // state.socket.on('connect', () => {
    //   console.log('Connected to the server', state.socket.id);
    // });

    state.socket.on('receive-message', (data) => {
      console.log(data);
      if (data.sender !== state.selectedChat)
        dispatch({ type: 'ADD_MESSAGE', payload: data.message });
    }
    )
  }, [state.socket]);
  useEffect(() => {
    // if (!state.selectedChat) return;
    // console.log('fetching messages')
    (async () => {
      try {
        console.log("2 times/////////////@@##$%")
        const res = await axios.get(`http://localhost:5000/chats/messages?s_id=${user.id}&r_id=${state.selectedChat}`);
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
    // console.log(state.messages)
    // state.messages.map((message) => console.log(message))
    try {
      const newMessage = {
        senderId: user.id,
        receiverId: state.selectedChat,
        message: message,
        time: new Date(),
      }
      const res = await axios.post('http://localhost:5000/chats/message', newMessage)
      state.socket.emit('send-message', { sender: user.id, receiver: state.selectedChat, message: newMessage });
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
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
  // state.messages.map((message) => console.log(message))

  return (
    <div className="flex h-full flex-col">
      {/* <div> */}
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
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
                  <Button variant="ghost" size="icon" disabled={!mail}>
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
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
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
            <Button variant="ghost" size="icon" disabled={!mail}>
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
      <Separator />
      {state.selectedChat ? (
        <div className="h-10 overflow-hidden relative flex flex-1 flex-col">
          <div className="flex  z-10 top-0 right-0 left-0 items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <ScrollArea className='h-screen'>
            <div className="flex flex-col gap-3 pb-[10.5rem] whitespace-pre-wrap p-4 text-sm">
              {
                state.messages.map((message) => (
                  <div key={message.time} className={`${(user.id === message.senderId) ? 'self-end bg-primary ' : 'self-start shadow-lg bg-secondary'} flex gap-2 w-max px-2 py-1 rounded-lg rounded-tr-none `}>
                    <p className={`text-primary${(user.id === message.senderId) ? '-foreground' : ''} text-md font-medium leading-7 h-max`}>{message.message}</p><p className="text-gray-400 text-[10px] leading-3  self-end ">{getTime(message.time)}</p>
                  </div>
                ))
              }
            </div>
          </ScrollArea>
          <Separator className="mt-auto" />
          <div className="p-4 bottom-0 left-0 right-0 z-10 bg-background absolute">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Reply ${mail.name}...`}
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
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
      {/* </div> */}
    </div>
  )
}
