// @flow
import * as ChatConstants from '../../../constants/chat'
import AttachmentMessageRender from './attachment'
import MessageText from './text'
import React from 'react'
import Timestamp from './timestamp'
import OldProfileResetNotice from '../notices/old-profile-reset-notice'
import ProfileResetNotice from '../notices/profile-reset-notice'
import {Box} from '../../../common-adapters'
import {formatTimeForMessages} from '../../../util/timestamp'

import type {Message, AttachmentMessage, ConversationIDKey, ServerMessage, MetaDataMap, FollowingMap, OutboxIDKey} from '../../../constants/chat'

type Options = {
  message: Message,
  includeHeader: boolean,
  key: string,
  isFirstNewMessage: boolean,
  style: Object,
  isScrolling: boolean,
  onAction: (message: ServerMessage, event: any) => void,
  isSelected: boolean,
  onLoadAttachment: (messageID: ChatConstants.MessageID, filename: string) => void,
  onOpenConversation: (conversationIDKey: ConversationIDKey) => void,
  onOpenInFileUI: (path: string) => void,
  onOpenInPopup: (message: AttachmentMessage) => void,
  onRetry: (outboxID: OutboxIDKey) => void,
  onRetryAttachment: () => void,
  you: string,
  metaDataMap: MetaDataMap,
  followingMap: FollowingMap,
}

const factory = (options: Options) => {
  const {
    message,
    includeHeader,
    key,
    isFirstNewMessage,
    style,
    onAction,
    isSelected,
    onLoadAttachment,
    onOpenConversation,
    onOpenInFileUI,
    onOpenInPopup,
    onRetry,
    onRetryAttachment,
    you,
    metaDataMap,
    followingMap,
  } = options

  if (!message) {
    return <Box key={key} style={style} />
  }
  // TODO hook up messageState and onRetry

  switch (message.type) {
    case 'Text':
      return <MessageText
        key={key}
        you={you}
        metaDataMap={metaDataMap}
        followingMap={followingMap}
        style={style}
        message={message}
        onRetry={onRetry}
        includeHeader={includeHeader}
        isFirstNewMessage={isFirstNewMessage}
        isSelected={isSelected}
        onAction={onAction}
        />
    case 'SupersededBy':
      return <OldProfileResetNotice
        onOpenNewerConversation={() => {console.log('todo', message.supersededBy); onOpenConversation(message.supersededBy)}}
        username={message.username}
        style={style}
        key={`supersededBy:${message.supersededBy}`}
        />
    case 'Supersedes':
      return <ProfileResetNotice
        onOpenOlderConversation={() => {console.log('todo', message.supersedes); onOpenConversation(message.supersedes)}}
        username={message.username}
        style={style}
        key={`supersedes:${message.supersedes}`}
        />
    case 'Timestamp':
      return <Timestamp
        timestamp={formatTimeForMessages(message.timestamp)}
        key={message.timestamp}
        style={style}
        />
    case 'Attachment':
      return <AttachmentMessageRender
        key={key}
        style={style}
        you={you}
        metaDataMap={metaDataMap}
        followingMap={followingMap}
        message={message}
        onRetry={onRetryAttachment}
        includeHeader={includeHeader}
        isFirstNewMessage={isFirstNewMessage}
        onLoadAttachment={onLoadAttachment}
        onOpenInFileUI={onOpenInFileUI}
        onOpenInPopup={onOpenInPopup}
        messageID={message.messageID}
        onAction={onAction}
        />
    default:
      return <Box key={key} style={style} data-msgType={message.type} />
  }
}

export default factory
