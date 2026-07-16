# AI Smart Notebook – Textbook Module UI & Functionality Update

Implement the following improvements and bug fixes to the AI Smart Notebook application. Follow the requirements carefully. Maintain the existing design language, color palette, typography, spacing, and component styling throughout the application.

---

## 1. Fix Header Navigation Buttons

The Forward and Back buttons in the header are currently non-functional.

### Requirements

* Make both buttons fully functional.
* Back button should navigate to the previous page/state.
* Forward button should navigate to the next page/state when available.
* Preserve navigation history correctly.
* Disable the buttons when navigation is not possible.

---

## 2. Improve Textbook Screen Layout

The current Textbook screen wastes a significant amount of vertical and horizontal space.

### Requirements

Keep the existing header exactly as it is.

Do NOT modify:

* Header height
* Header design
* Header controls
* Header styling

Everything below the header should be redesigned to utilize the full available screen.

The content area should occupy the complete remaining viewport.

Minimize unnecessary margins and padding.

The layout should feel like a modern productivity application similar to Notion, GoodNotes, OneNote, or Obsidian.

---

## 3. Split Workspace Layout

After the user selects a Subject and then opens a Chapter, the workspace should automatically transform into a split-screen layout.

### Default Layout

---

## |                    Header                           |

|             |                                      |
|             |                                      |
| Textbook    |          Notebook                    |
| PDF Viewer  |                                      |
|             |                                      |
|             |                                      |
------------------------------------------------------

The left side displays the textbook PDF.

The right side displays the notebook.

Both panels should be visible simultaneously.

---

## 4. PDF Viewer

When a chapter is opened:

Automatically load the chapter PDF.

Requirements:

* Large readable PDF
* Smooth scrolling
* Zoom support
* High-quality rendering
* Fast page switching
* Preserve page position
* Responsive layout

The PDF should occupy approximately 50% of the screen by default.

---

## 5. Notebook Panel

The existing Notebook implementation is good.

Keep the existing notebook functionality.

Improve only the layout.

The notebook should occupy the right side of the split view.

Users should continue taking notes while reading the textbook.

No modal or popup should appear.

Notebook should always remain visible.

---

## 6. Adjustable Split View

Instead of fixed 50/50 panels, create a draggable divider.

Requirements:

* Users can drag the divider.
* Resize both panels smoothly.
* Maintain minimum widths.
* Smooth animation.
* Save the last panel sizes during the session.

Example:

30% PDF | 70% Notebook

or

60% PDF | 40% Notebook

or

50% | 50%

The resizing should feel professional and fluid.

---

## 7. Future-Proof Left Panel System

Design the layout so the left panel can host multiple tools in the future.

Initially, it should contain:

* Textbook PDF

In future, it should also support:

* AI Tutor
* Other learning tools

Therefore, build the layout using reusable components rather than hardcoding only the PDF viewer.

---

## 8. AI Tutor Integration

There is already an AI Tutor button in the header.

Prepare the workspace so that when the user clicks the AI Tutor button:

The left panel should switch from:

Textbook PDF

to

AI Tutor

without opening a popup or new page.

Example:

Before

Left:
PDF Viewer

Right:
Notebook

After clicking AI Tutor

Left:
AI Tutor

Right:
Notebook

Users should still be able to resize both panels.

The Notebook must always remain on the right side.

Do not implement the AI Tutor functionality yet—only prepare the layout and architecture for this behavior.

---

## 9. Better Use of Screen Space

Remove unnecessary whitespace.

Increase the usable workspace.

Ensure:

* Larger reading area
* Larger writing area
* Better alignment
* Better spacing
* Cleaner visual hierarchy

The interface should feel like a professional digital notebook rather than a traditional webpage.

---

## 10. Responsive Behaviour

The layout should adapt to different screen sizes.

Desktop and tablet layouts should remain clean and functional.

Maintain usability even on smaller displays.

---

## 11. Performance

Ensure the redesign remains performant.

Requirements:

* No unnecessary re-renders
* Lazy load PDFs where possible
* Smooth scrolling
* Smooth resizing
* Efficient state management
* Maintain high responsiveness

---

## 12. UI/UX Goals

The final experience should feel polished, modern, and premium.

Inspiration (for UX only, not visual copying):

* GoodNotes
* OneNote
* Notion
* Obsidian
* Apple Books
* Adobe Acrobat split view

Do not copy their design directly.

Maintain the existing branding and visual identity of the AI Smart Notebook.

---

## Important Notes

* The provided reference images are only for understanding the layout and workflow.
* Do not replicate the reference images exactly.
* Create an original, clean, modern, and production-ready interface.
* Preserve the current application theme and styling.
* Focus on maximizing usability, readability, and multitasking.

The final result should provide students with a distraction-free workspace where they can read the textbook, take notes simultaneously, and seamlessly switch the left panel between the textbook and AI Tutor in the future, all within a flexible, resizable split-screen interface.
