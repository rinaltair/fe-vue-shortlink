/**
 * Emojis
 * Use in messages to display corresponding emojis
 *
 * Usage
 * ElMessage.success(`${EmojiText[200]} Image uploaded successfully`)
 * ElMessage.error(`${EmojiText[400]} Image upload failed`)
 * ElMessage.error(`${EmojiText[500]} Image upload failed`)
 */

// macOS users: press shift + 6 to open more emojis…
const EmojiText: { [key: string]: string } = {
  '0': 'O_O', // Empty
  '200': '^_^', // Success
  '400': 'T_T', // Bad Request
  '500': 'X_X' // Internal Server Error
}

// const EmojiIcon = ['🟢', '🔴', '🟡 ', '🚀', '✨', '💡', '🛠️', '🔥', '🎉', '🌟', '🌈']

export default EmojiText
