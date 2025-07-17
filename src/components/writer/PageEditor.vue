<template>
  <div v-if="item">
    <div class="PageEditorScroll" ref="scrolltarget">
      <EditorContent :editor="editor" v-if="editor" />
    </div>

    <div class="titleBar" v-if="item">
      <input
        type="text"
        :placeholder="this.$root.setlang.writer.newfile"
        v-model="item.title"
        @change="changed"
      />
    </div>
    <div class="static-toolbar">
      <div class="toolbar-background"></div>
      <button
        @click="this.$root.session.selectedTool = 'distractionfree'"
        :title="this.$root.setlang.editor.typewriter"
        class="distraction-free-btn"
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M20 13H16C16 14.1 15.1 15 14 15H10C8.9 15 8 14.1 8 13H4L2 18V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V18M18 10V3H6V10H3V12H21V10M8 5H16V6H8M8 7H14V8H8"
          />
        </svg>
      </button>
      <button
        v-if="showLeftArrow"
        @click="scrollToolbar(-1)"
        class="scroll-arrow left-arrow"
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
          />
        </svg>
      </button>

      <div class="scrolling-toolbar-area" ref="toolbar">
        <div class="toolbar-content-wrapper">
          <template v-if="editor">
            <button
              @click="editor.chain().focus().undo().run()"
              :disabled="!editor.can().undo()"
              title="Undo"
            >
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z"
                />
              </svg>
            </button>
            <button
              @click="editor.chain().focus().redo().run()"
              :disabled="!editor.can().redo()"
              title="Redo"
            >
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  d="M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.53,15.22L3.9,16C4.95,12.81 7.96,10.5 11.5,10.5C13.46,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z"
                />
              </svg>
            </button>
            <button
              @click="editor.chain().focus().toggleBold().run()"
              :class="{ 'is-active': editor.isActive('bold') }"
              :title="this.$root.setlang.editor.bold"
            >
              <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z"
                />
              </svg>
            </button>

            <button
              @click="editor.chain().focus().toggleItalic().run()"
              :class="{ 'is-active': editor.isActive('italic') }"
              :title="this.$root.setlang.editor.italic"
            >
              <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z"
                />
              </svg>
            </button>

            <button
              @click="editor.chain().focus().toggleUnderline().run()"
              :class="{ 'is-active': editor.isActive('underline') }"
              title="Underline"
            >
              <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                <path
                  d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z"
                />
              </svg>
            </button>

            <button
              @click="editor.chain().focus().toggleStrike().run()"
              :class="{ 'is-active': editor.isActive('strike') }"
              :title="this.$root.setlang.editor.strikethrough"
            >
              <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M23,12V14H18.61C19.61,16.14 19.56,22 12.38,22C4.05,22.05 4.37,15.5 4.37,15.5L8.34,15.55C8.37,18.92 11.5,18.92 12.12,18.88C12.76,18.83 15.15,18.84 15.34,16.5C15.42,15.41 14.32,14.58 13.12,14H1V12H23M19.41,7.89L15.43,7.86C15.43,7.86 15.6,5.09 12.15,5.08C8.7,5.06 9,7.28 9,7.56C9.04,7.84 9.34,9.22 12,9.88H5.71C5.71,9.88 2.22,3.15 10.74,2C19.45,0.8 19.43,7.91 19.41,7.89Z"
                />
              </svg>
            </button>

            <button
              @click="setLink"
              :class="{ 'is-active': editor.isActive('link') }"
              title="Hyperlink"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path
                  d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,10.59C13.8,10.2 14.44,10.2 14.83,10.59C16.78,12.54 16.78,15.71 14.83,17.76L11.29,21.29C9.34,23.24 6.17,23.24 4.22,21.29C2.27,19.34 2.27,16.17 4.22,14.22L5.71,12.73C5.7,13.55 5.83,14.37 6.11,15.15L5.64,15.63C4.46,16.81 4.46,18.71 5.64,19.88C6.81,21.06 8.71,21.06 9.88,19.88L13.41,16.35C14.59,15.18 14.59,13.28 13.41,10.59Z"
                />
              </svg>
            </button>
            <div
              class="toolbar-group"
              :class="{ 'is-expanded': headingsMenuOpen }"
            >
              <button
                @click="headingsMenuOpen = !headingsMenuOpen"
                title="Formatting Styles"
                class="dropdown-trigger"
                :class="{ 'is-open': headingsMenuOpen }"
              >
                <svg
                  v-if="headingsMenuOpen"
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path d="M10,17L15,12L10,7V17Z" />
                </svg>
                <svg
                  v-else
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12H11V18H9V4H13M13,10A2,2 0 0,0 15,8A2,2 0 0,0 13,6H11V10H13Z"
                  />
                </svg>
              </button>
              <template v-if="headingsMenuOpen">
                <button
                  @click="editor.chain().focus().setParagraph().run()"
                  :class="{ 'is-active': editor.isActive('paragraph') }"
                  title="Paragraph"
                >
                  <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12H11V18H9V4H13M13,10A2,2 0 0,0 15,8A2,2 0 0,0 13,6H11V10H13Z"
                    />
                  </svg>
                </button>
                <button
                  @click="
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 1 }),
                  }"
                  title="Heading 1"
                >
                  <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16V6.31L13.5,7.75V5.44L16,4H18V16H20V18H14Z"
                    />
                  </svg>
                </button>
                <button
                  @click="
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 2 }),
                  }"
                  title="Heading 2"
                >
                  <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,18H15A2,2 0 0,1 13,16C13,15.47 13.2,15 13.54,14.64L18.41,9.41C18.78,9.05 19,8.55 19,8A2,2 0 0,0 17,6A2,2 0 0,0 15,8H13A4,4 0 0,1 17,4A4,4 0 0,1 21,8C21,9.1 20.55,10.1 19.83,10.83L15,16H21V18Z"
                    />
                  </svg>
                </button>
                <button
                  @click="
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  "
                  :class="{
                    'is-active': editor.isActive('heading', { level: 3 }),
                  }"
                  title="H3"
                >
                  <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                    <path
                      d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M15,4H19A2,2 0 0,1 21,6V16A2,2 0 0,1 19,18H15A2,2 0 0,1 13,16V15H15V16H19V12H15V10H19V6H15V7H13V6A2,2 0 0,1 15,4Z"
                    />
                  </svg>
                </button>
              </template>
            </div>

            <div
              class="toolbar-group"
              :class="{ 'is-expanded': alignmentMenuOpen }"
            >
              <button
                @click="alignmentMenuOpen = !alignmentMenuOpen"
                title="Alignment"
                class="dropdown-trigger"
                :class="{ 'is-open': alignmentMenuOpen }"
              >
                <svg
                  v-if="alignmentMenuOpen"
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path d="M10,17L15,12L10,7V17Z" />
                </svg>
                <svg
                  v-else
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z"
                  />
                </svg>
              </button>
              <template v-if="alignmentMenuOpen">
                <button
                  @click="editor.chain().focus().setTextAlign('left').run()"
                  :class="{
                    'is-active': editor.isActive({ textAlign: 'left' }),
                  }"
                  title="Align Left"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M3,3H21V5H3V3M3,7H15V9H3V7M3,11H21V13H3V11M3,15H15V17H3V15M3,19H21V21H3V19Z"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().setTextAlign('center').run()"
                  :class="{
                    'is-active': editor.isActive({ textAlign: 'center' }),
                  }"
                  title="Align Center"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M3,3H21V5H3V3M7,7H17V9H7V7M3,11H21V13H3V11M7,15H17V17H7V15M3,19H21V21H3V19Z"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().setTextAlign('right').run()"
                  :class="{
                    'is-active': editor.isActive({ textAlign: 'right' }),
                  }"
                  title="Align Right"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M3,3H21V5H3V3M9,7H21V9H9V7M3,11H21V13H3V11M9,15H21V17H9V15M3,19H21V21H3V19Z"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().setTextAlign('justify').run()"
                  :class="{
                    'is-active': editor.isActive({ textAlign: 'justify' }),
                  }"
                  title="Justify"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"
                    />
                  </svg>
                </button>
              </template>
            </div>

            <div class="toolbar-group" :class="{ 'is-expanded': listMenuOpen }">
              <button
                @click="listMenuOpen = !listMenuOpen"
                title="Lists"
                class="dropdown-trigger"
                :class="{ 'is-open': listMenuOpen }"
              >
                <svg
                  v-if="listMenuOpen"
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path d="M10,17L15,12L10,7V17Z" />
                </svg>
                <svg
                  v-else
                  style="width: 24px; height: 24px"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9"
                  />
                </svg>
              </button>
              <template v-if="listMenuOpen">
                <button
                  @click="editor.chain().focus().toggleBulletList().run()"
                  :class="{ 'is-active': editor.isActive('bulletList') }"
                  :title="this.$root.setlang.editor.blist"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M3,4H7V8H3V4M9,5V7H21V5H9M3,10H7V14H3V10M9,11V13H21V11H9M3,16H7V20H3V16M9,17V19H21V17H9"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().toggleOrderedList().run()"
                  :class="{ 'is-active': editor.isActive('orderedList') }"
                  :title="this.$root.setlang.editor.nlist"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M7,13V11H21V13H7M7,19V17H21V19H7M7,7V5H21V7H7M3,8V5H2V4H4V8H3M2,17V16H5V20H2V19H4V18.5H3V17.5H4V17H2M4.25,10A0.75,0.75 0 0,1 5,10.75C5,10.95 4.92,11.14 4.79,11.27L3.12,13H5V14H2V13.08L4,11H2V10H4.25Z"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().sinkListItem('listItem').run()"
                  :disabled="!editor.can().sinkListItem('listItem')"
                  title="Indent"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M11,13H21V11H11M11,9H21V7H11M11,17H21V15H11M3,4L7,8L3,12V4Z"
                    />
                  </svg>
                </button>
                <button
                  @click="editor.chain().focus().liftListItem('listItem').run()"
                  :disabled="!editor.can().liftListItem('listItem')"
                  title="Outdent"
                >
                  <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                    <path
                      d="M11,13H21V11H11M11,9H21V7H11M11,17H21V15H11M7,4L3,8L7,12V4Z"
                    />
                  </svg>
                </button>
              </template>
            </div>

            <button @click="addImage" :title="this.$root.setlang.editor.pic">
              <svg version="1.1" width="24" height="24" viewBox="0 0 24 24">
                <path
                  d="M13 19C13 19.7 13.13 20.37 13.35 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3H19C20.11 3 21 3.9 21 5V13.35C20.37 13.13 19.7 13 19 13V5H5V19H13M13.96 12.29L11.21 15.83L9.25 13.47L6.5 17H13.35C13.75 15.88 14.47 14.91 15.4 14.21L13.96 12.29M20 18V15H18V18H15V20H18V23H20V20H23V18H20Z"
                />
              </svg>
            </button>
          </template>
        </div>
      </div>
      <button
        v-if="showRightArrow"
        @click="scrollToolbar(1)"
        class="scroll-arrow right-arrow"
      >
        <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
          <path
            d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
          />
        </svg>
      </button>
    </div>

    <div class="wordcountdisplay" v-if="item">
      {{ item.wordcount }} / {{ this.$root.fullWordCount }}
    </div>
    <LinkModal
      v-if="isLinkModalVisible"
      :initial-url="editingLink.url"
      :initial-new-tab="editingLink.newTab"
      @close="closeLinkModal"
      @apply="handleApplyLink"
      @remove="handleRemoveLink"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-3";
import { DOMParser } from "prosemirror-model";

// CORE EXTENSIONS
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import History from "@tiptap/extension-history";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
// ** NEW IMPORT **
import Link from "@tiptap/extension-link";
// ADDITIONAL EXTENSIONS
import HardBreak from "@tiptap/extension-hard-break";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import LinkModal from "../popups/LinkModal.vue";
import { debounce } from "lodash";

export default {
  name: "NewPage",
  props: {
    pageuuid: String,
  },
  components: {
    EditorContent,
    LinkModal,
  },
  data() {
    return {
      item: this.$root.useObservable(
        this.$root.liveQuery(
          async () => await this.$root.db.Files.get(this.pageuuid)
        )
      ),
      editor: null,
      isLinkModalVisible: false,
      editingLink: { url: "", newTab: true },
      headingsMenuOpen: false,
      alignmentMenuOpen: false,
      listMenuOpen: false,
      showLeftArrow: false,
      showRightArrow: false,
      toolbarObserver: null,
      debouncedUpdate: null,
      containerObserver: null,
    };
  },
  methods: {
    // ** NEW METHOD START **
    // In the methods object, replace the entire setLink method
    // Inside the methods: { ... } object
    setLink() {
      const attrs = this.editor.getAttributes("link");
      this.editingLink = {
        url: attrs.href || "",
        newTab: attrs.target === "_blank",
      };
      this.isLinkModalVisible = true;
    },
    initializeDebouncedUpdate() {
      this.debouncedUpdate = debounce(() => {
        this.item.content = this.editor.getHTML();
        this.item.wordcount = this.$root.wordCounter(this.editor.getHTML());
        this.changed();
      }, 500); // 500ms delay
    },

    handleApplyLink(payload) {
      if (payload.href) {
        this.editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({
            href: payload.href,
            target: payload.newTab ? "_blank" : null,
          })
          .run();
      } else {
        this.handleRemoveLink();
      }
    },

    handleRemoveLink() {
      this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
    },

    closeLinkModal() {
      this.isLinkModalVisible = false;
      this.editingLink = { url: "", newTab: true };
    },

    // ** NEW METHOD END **

    // All your other methods like wordcountToggle, repositionEditor, etc. go here
    changed() {
      this.$root.UpdateRecord("Files", this.item.uuid, this.item);
    },
    scrollToolbar(direction) {
      const toolbar = this.$refs.toolbar;
      if (toolbar) {
        toolbar.scrollBy({ left: 200 * direction, behavior: "smooth" });
      }
    },
    // In your methods object
    // In your methods: { ... }
    checkArrowVisibility() {
      const toolbar = this.$refs.toolbar;
      if (!toolbar) return;

      const scrollLeft = toolbar.scrollLeft;
      const scrollWidth = toolbar.scrollWidth;
      const clientWidth = toolbar.clientWidth;

      // The maximum value the scrollLeft can be
      const maxScrollLeft = scrollWidth - clientWidth;

      // Use a 1px tolerance for floating point safety
      const isScrollable = maxScrollLeft > 1;

      // Show left arrow if we aren't at the very beginning
      this.showLeftArrow = isScrollable && scrollLeft > 1;

      // Show right arrow if we aren't at the very end
      this.showRightArrow = isScrollable && scrollLeft < maxScrollLeft - 1;

      // Set gradient visibility
      if (isScrollable) {
        toolbar.classList.add("is-scrollable");
      } else {
        toolbar.classList.remove("is-scrollable");
      }
    },
  },
  mounted() {
    // 1. Watch for the 'item' data to be loaded from the database
    this.$watch(
      "item",
      (newItem) => {
        // Make sure we have data and an editor instance hasn't been created yet
        if (newItem && !this.editor) {
          // 2. NOW, create the Tiptap editor instance
          this.editor = new Editor({
            extensions: [
              Document,
              Paragraph,
              Text,
              Bold,
              Italic,
              Strike,
              Underline,
              // ** NEW EXTENSION CONFIGURATION **
              Link.configure({
                autolink: true,
                openOnClick: true,
              }),
              Heading.configure({ levels: [1, 2, 3] }),
              BulletList,
              OrderedList,
              ListItem,
              History,
              Dropcursor,
              Gapcursor,
              Typography,
              Image,
              Highlight.configure({ multicolor: true }),
              TextAlign.configure({
                types: ["heading", "paragraph"],
                defaultAlignment: "left",
              }),
            ],
            editorProps: {
              handleDOMEvents: {
                paste(view, event) {
                  let pastedHTML = event.clipboardData.getData("text/html");
                  if (pastedHTML) {
                    // Use ProseMirror's DOMParser to correctly parse the pasted HTML
                    let slice = DOMParser.fromSchema(
                      view.state.schema
                    ).parseSlice(
                      new DOMParser().parseFromString(pastedHTML, "text/html")
                    );
                    // Dispatch a transaction to insert the parsed content
                    view.dispatch(view.state.tr.replaceSelection(slice));
                    return true; // We've handled the paste event
                  }
                  return false; // Let ProseMirror handle the default (plain text)
                },
              },
            },
            content: newItem.content,
            onUpdate: () => {
              if (!this.item) return;
              this.debouncedUpdate();
            },
            onSelectionUpdate: () => {
              this.$forceUpdate();
            },
          });
          this.initializeDebouncedUpdate();

          // 4. Set up observers and listeners only ONCE
          this.$nextTick(() => {
            const toolbar = this.$refs.toolbar;
            if (toolbar) {
              this.toolbarObserver = new MutationObserver(() =>
                this.checkArrowVisibility()
              );
              this.toolbarObserver.observe(toolbar, {
                childList: true,
                subtree: true,
              });

              this.containerObserver = new ResizeObserver(() =>
                this.checkArrowVisibility()
              );
              this.containerObserver.observe(toolbar.parentElement);

              toolbar.addEventListener("scroll", this.checkArrowVisibility);
              window.addEventListener("resize", this.checkArrowVisibility);

              this.checkArrowVisibility();
            }
          });
        }
        // This handles changing to a DIFFERENT file later
        else if (newItem && this.editor) {
          const isSameContent = this.editor.getHTML() === newItem.content;
          if (!isSameContent) {
            // The correct, documented way to load content without adding an undo step
            this.editor.commands.setContent(newItem.content, false, {
              addToHistory: false,
            });
          }
        }
      },
      {
        immediate: true,
        deep: true, // Watch for nested changes
      }
    );
  },
  beforeUnmount() {
    // Clean up everything to prevent memory leaks
    if (this.editor) {
      this.editor.destroy();
    }
    const toolbar = this.$refs.toolbar;
    if (toolbar) {
      toolbar.removeEventListener("scroll", this.checkArrowVisibility);
    }
    window.removeEventListener("resize", this.checkArrowVisibility);
    if (this.toolbarObserver) {
      this.toolbarObserver.disconnect();
    }
    if (this.containerObserver) {
      this.containerObserver.disconnect();
    }
  },
};
</script>

<style scoped>
.right-arrow {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}

/* ADD THESE RULES */
.PageEditorScroll :deep(.ProseMirror a) {
  color: var(--accent);
  cursor: pointer;
  pointer-events: auto;
}
.hilighter {
  position: absolute;
  padding: 5px;
  right: 0px;

  width: 30px;
  text-align: center;
  margin: 0 auto;
}

.hilighter button {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid #fff;
  margin: 2px;
}

.hilighter button:hover,
.hilighter button:focus,
.hilighter button:active {
  border: 2px solid #424242;
}

.titleBar {
  position: absolute;
  top: 0px;
  background-color: var(--writer-title-bar);
  color: var(--writer-title-bar-f);
  height: 40px;
  width: 100%;
}

.titleBar input {
  width: 100%;
  background-color: inherit;
  color: inherit;
  outline: none;
  height: 40px;
  border: 0px;
  padding-left: 20px;
  padding-right: 20px;
  font-family: inherit;
  font-size: 1.5rem;
}
/* The wrapper for a group of buttons like 'Styles' */

/* THIS IS THE FIX: Add this rule back to make the menu solid */
.toolbar-group.is-expanded {
  background-color: var(--writer-title-bar);
  border-radius: 0px;
  margin-right: 0px;
}
/* Hides the scrollbar on Chrome, Safari, and Opera */
.toolbar::-webkit-scrollbar {
  display: none;
}

button {
  position: relative;
  background-color: var(--writer-button-bar);
  border: 0px;
  outline: none;
  height: 40px;
  width: 40px;
  cursor: pointer;
  text-align: center;
  padding-bottom: 7px;
  -webkit-tap-highlight-color: transparent;
}

button svg {
  position: relative;
  fill: var(--writer-button-bar-f);
  width: 20px;
  top: 4px;
  left: 0px;
  z-index: 1;
}

.strikefix {
  /*
  Strikethrough icon looks wierdly bigger
  width: 12px;
  */
}
/* This style applies on the "press" for ALL devices */
button:active {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}
button:active svg {
  fill: var(--button-hover-f);
}

/* These styles apply ONLY to devices that can truly hover (like a mouse) */
@media (hover: hover) {
  button:hover {
    background-color: var(--button-hover);
    color: var(--button-hover-f);
  }
  button:hover svg {
    fill: var(--button-hover-f);
  }
  .toolbar-group button:hover {
    background-color: var(--accent) !important;
    color: var(--accent-f) !important;
    fill: var(--accent-f) !important;
  }
}

/* This is your existing focus style for keyboard accessibility, it is correct */
button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent) inset;
}

/* --- End of Replacement Block --- */

.wordcountdisplay {
  position: absolute;
  bottom: 0px;
  right: 10px;
  width: 100px;
  background-color: var(--accent);
  color: var(--accent-f);
  z-index: 200;
  padding: 5px;
  border-radius: 5px 5px 0px 0px;
  text-align: center;
}

mark {
  background-color: #ffe066;
  padding: 0.125em 0;
  border-radius: 0.25em;
  box-decoration-break: clone;
}

.body-blue {
  color: blue;
}

.body-red {
  color: red;
}

.body-green {
  color: green;
}

/* --- Final Toolbar Group Styles --- */

/* The wrapper for a group of buttons like 'Styles' */
.toolbar-group {
  display: inline-flex; /* Use flexbox to keep items in a row */
  background-color: var(--writer-button-bar); /* or your desired color */
  position: relative; /* ADD THIS */
  z-index: 10;
}

/* This makes the EXPANDED part of the menu have the darker background */

/* General style for ALL buttons inside the group */
.toolbar-group button {
  background-color: transparent; /* Buttons are transparent by default */
  color: var(--writer-button-bar-f); /* Standard text/icon color */
  fill: var(--writer-button-bar-f);
}

/* Hover effect for any button in the group */
.toolbar-group button:hover {
  background-color: var(--accent) !important;
  color: var(--accent-f) !important;
  fill: var(--accent-f) !important;
}

/* When the group is expanded, this makes sure the icons and text have the right color */
.toolbar-group.is-expanded button {
  color: var(--writer-title-bar-f);
  fill: var(--writer-title-bar-f);
}

/* --- FINAL SIMPLIFIED TOOLBAR STYLES --- */

/* This is the main static container */
.static-toolbar {
  position: absolute; /* ADD THIS */
  top: 40px; /* ADD THIS (to position it below the title bar) */
  display: flex;
  align-items: center;
  /* Add these to be safe */
  left: 0;
  right: 0;
  width: 100%;
  height: 40px;
  z-index: 10;
}
/* NEW STYLE RULE FOR THE BACKGROUND ELEMENT */
.toolbar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--writer-button-bar);
  z-index: -1; /* Place it behind everything else in the toolbar */
}

/* This is the inner area that contains the buttons and scrolls (FIXED) */

.scrolling-toolbar-area {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
  height: 100%;

  /* Hide the scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.toolbar-content-wrapper {
  display: flex;
  align-items: center;
  margin: auto;
}
/* NEW: Bulletproof fade effect using pseudo-elements */
.scrolling-toolbar-area.is-scrollable::before,
.scrolling-toolbar-area.is-scrollable::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px; /* How wide the fade effect is */
  z-index: 2; /* Make sure it's above the buttons */

  /* This is the key: makes the fade unclickable so you can click buttons underneath */
  pointer-events: none;
}

.scrolling-toolbar-area.is-scrollable::before {
  left: 0;
  background: linear-gradient(to right, var(--writer-button-bar), transparent);
}

.scrolling-toolbar-area.is-scrollable::after {
  right: 0;
  background: linear-gradient(to left, var(--writer-button-bar), transparent);
}

.scrolling-toolbar-area::-webkit-scrollbar {
  display: none;
}

/* ... the rest of your styles ... */
/* NEW: Specific style for the distraction free button */
.distraction-free-btn {
  flex-shrink: 0; /* Prevent this button from shrinking */
  width: 40px;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.2); /* The line separating it from the scroll area */
}
/* --- NEW ARROW BUTTON STYLES --- */

/* Base style for both arrow buttons */
.scroll-arrow {
  flex-shrink: 0; /* Prevent arrows from shrinking */
  width: 30px; /* Make them thinner */
  height: 100%;
  z-index: 2; /* Ensure they are above the scrolling content's fade mask */
  background-color: var(--writer-button-bar);
  border: 0;
  padding: 0;
}

.scroll-arrow svg {
  width: 24px;
  height: 24px;
}

/* Specific border for visual separation */
.left-arrow {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}

.right-arrow {
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
