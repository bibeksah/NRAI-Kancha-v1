import { ChatContainer } from "@/components/kancha/chat-container"

export default function EmbedPage() {
  return (
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <ChatContainer initialLanguage="ne" isEmbedded={true} />
    </div>
  )
}
