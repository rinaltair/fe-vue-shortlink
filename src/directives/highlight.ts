import { App, Directive } from 'vue'
import hljs from 'highlight.js'
import { ElMessage } from 'element-plus'

/**
 * Code highlighting
 * Inserts line numbers, adds a copy button, and processes code blocks in batches to avoid jank with large content.
 * Supports dynamic content via MutationObserver to ensure all code blocks are handled.
 */

// Highlight a single code block
function highlightCode(block: HTMLElement) {
  hljs.highlightElement(block)
}

// Insert line numbers
function insertLineNumbers(block: HTMLElement) {
  const lines = block.innerHTML.split('\n')
  const numberedLines = lines
    .map((line, index) => {
      return `<span class="line-number">${index + 1}</span> ${line}`
    })
    .join('\n')
  block.innerHTML = numberedLines
}

// Add copy button: adjust DOM structure, wrap code in .code-wrapper
function addCopyButton(block: HTMLElement) {
  const copyButton = document.createElement('i')
  copyButton.className = 'copy-button iconfont-sys'
  copyButton.innerHTML = '&#xe7b2;'
  copyButton.onclick = () => {
    // Strip line numbers; copy code only
    const codeContent = block.innerText.replace(/^\d+\s+/gm, '')
    navigator.clipboard.writeText(codeContent).then(() => {
      ElMessage.success('Copied')
    })
  }

  const preElement = block.parentElement
  if (preElement) {
    let codeWrapper: HTMLElement
    // Create wrapper if not wrapped yet
    if (!block.parentElement.classList.contains('code-wrapper')) {
      codeWrapper = document.createElement('div')
      codeWrapper.className = 'code-wrapper'
      preElement.replaceChild(codeWrapper, block)
      codeWrapper.appendChild(block)
    } else {
      codeWrapper = block.parentElement
    }
    // Append copy button to the pre element so it doesn't scroll with content
    preElement.appendChild(copyButton)
  }
}

// Check whether a block has been processed
function isBlockProcessed(block: HTMLElement): boolean {
  return (
    block.hasAttribute('data-highlighted') ||
    !!block.querySelector('.line-number') ||
    !!block.parentElement?.querySelector('.copy-button')
  )
}

// Mark block as processed
function markBlockAsProcessed(block: HTMLElement) {
  block.setAttribute('data-highlighted', 'true')
}

// Process a single code block
function processBlock(block: HTMLElement) {
  if (isBlockProcessed(block)) {
    return
  }

  try {
    highlightCode(block)
    insertLineNumbers(block)
    addCopyButton(block)
    markBlockAsProcessed(block)
  } catch (error) {
    console.warn('Error processing code block:', error)
  }
}

// Find and process all code blocks under an element
function processAllCodeBlocks(el: HTMLElement) {
  const blocks = Array.from(el.querySelectorAll<HTMLElement>('pre code'))
  const unprocessedBlocks = blocks.filter((block) => !isBlockProcessed(block))

  if (unprocessedBlocks.length === 0) {
    return
  }

  if (unprocessedBlocks.length <= 10) {
    // If 10 or fewer, process all directly
    unprocessedBlocks.forEach((block) => processBlock(block))
  } else {
    // Batch size per frame
    const batchSize = 10
    let currentIndex = 0

    const processBatch = () => {
      const batch = unprocessedBlocks.slice(currentIndex, currentIndex + batchSize)

      batch.forEach((block) => {
        processBlock(block)
      })

      // Update index and process next batch
      currentIndex += batchSize
      if (currentIndex < unprocessedBlocks.length) {
        // Use requestAnimationFrame to defer to next frame
        requestAnimationFrame(processBatch)
      }
    }

    // Start processing first batch
    processBatch()
  }
}

// Retry helper
function retryProcessing(el: HTMLElement, maxRetries: number = 3, delay: number = 200) {
  let retryCount = 0

  const tryProcess = () => {
    processAllCodeBlocks(el)

    // Check for remaining unprocessed blocks
    const remainingBlocks = Array.from(el.querySelectorAll<HTMLElement>('pre code')).filter(
      (block) => !isBlockProcessed(block)
    )

    if (remainingBlocks.length > 0 && retryCount < maxRetries) {
      retryCount++
      setTimeout(tryProcess, delay * retryCount) // incremental delay
    }
  }

  tryProcess()
}

// Highlighting directive: line numbers and copy button
const highlightDirective: Directive<HTMLElement> = {
  mounted(el: HTMLElement) {
    // Try once immediately
    processAllCodeBlocks(el)

    // Delay to ensure v-html content is rendered
    setTimeout(() => {
      retryProcessing(el)
    }, 100)

    // Observe DOM changes with MutationObserver
    const observer = new MutationObserver((mutations) => {
      let hasNewCodeBlocks = false

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              // Check if newly added node contains code blocks
              if (element.tagName === 'PRE' || element.querySelector('pre code')) {
                hasNewCodeBlocks = true
              }
            }
          })
        }
      })

      if (hasNewCodeBlocks) {
        // Delay processing newly added code blocks
        setTimeout(() => {
          processAllCodeBlocks(el)
        }, 50)
      }
    })

    // Start observing
    observer.observe(el, {
      childList: true,
      subtree: true
    })

    // Store observer for cleanup on unmounted
    ;(el as any)._highlightObserver = observer
  },

  updated(el: HTMLElement) {
    // Reprocess on component update
    setTimeout(() => {
      processAllCodeBlocks(el)
    }, 50)
  },

  unmounted(el: HTMLElement) {
    // Cleanup MutationObserver
    const observer = (el as any)._highlightObserver
    if (observer) {
      observer.disconnect()
      delete (el as any)._highlightObserver
    }
  }
}

export function setupHighlightDirective(app: App) {
  app.directive('highlight', highlightDirective)
}
