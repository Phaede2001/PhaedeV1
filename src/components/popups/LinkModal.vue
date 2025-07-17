<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-dialog">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEditing ? "Edit Link" : "Add Link" }}</h2>
      </div>
      <div class="modal-body">
        <div>
          <label for="urlInput" class="modal-label">URL</label>
          <input
            type="text"
            id="urlInput"
            v-model="url"
            placeholder="https://example.com"
            class="modal-input"
            ref="urlInput"
          />
        </div>

        <div class="mt-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="newTab" class="modal-checkbox" />
            <span class="ml-2 text-sm text-gray-700">Open in new tab</span>
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <div class="flex gap-3">
          <button v-if="isEditing" @click="remove" class="remove-link-btn">
            Remove Link
          </button>
          <button @click="close" class="modal-btn-secondary">Cancel</button>
        </div>
        <button @click="apply" class="modal-btn-primary">
          {{ isEditing ? "Save" : "Apply" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LinkModal",
  props: {
    initialUrl: {
      type: String,
      default: "",
    },
    initialNewTab: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      url: this.initialUrl,
      newTab: this.initialNewTab,
      isEditing: !!this.initialUrl,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.urlInput.focus();
      this.$refs.urlInput.select();
    });
  },
  methods: {
    close() {
      this.$emit("close");
    },
    apply() {
      let finalUrl = this.url;
      if (
        finalUrl &&
        !finalUrl.startsWith("http://") &&
        !finalUrl.startsWith("https://")
      ) {
        finalUrl = `http://${finalUrl}`;
      }
      this.$emit("apply", { href: finalUrl, newTab: this.newTab });
      this.close();
    },
    remove() {
      this.$emit("remove");
      this.close();
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(31, 41, 55, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  font-family: inherit; /* Inherit the main app font */
}
.modal-dialog {
  background-color: var(--writer-bg); /* Use main dark background */
  color: var(--writer-color); /* Use main text color */
  border-radius: 0; /* Square corners */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 32rem;
  margin: 0.5rem;
}
.modal-header {
  background-color: var(--writer-title-bar); /* Title bar background */
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--ui-border, #4b5563);
}
.modal-title {
  font-size: 1.5rem; /* Standardized font size */
  font-weight: 600;
  margin: 0.5rem;
}
.modal-body {
  background-color: var(--window);
  padding: 1.5rem; /* Spacing for the content */
}
.modal-label {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--ui-border, #d1d5db);
  border-radius: 0;
  background-color: var(--main-bg, #ffffff); /* White background for input */
  color: var(--main-color, #1f2937); /* Dark text for input */
  font-size: 1rem;
}
.modal-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-faded, rgba(220, 38, 38, 0.4));
  border-color: var(--accent, #dc2626);
}
.modal-checkbox {
  height: 1rem;
  width: 1rem;
  border-radius: 0.1rem;
  border-color: var(--ui-border, #d1d5db);
  color: var(--accent, #dc2626);
}
.modal-checkbox:focus {
  ring: var(--accent, #dc2626);
}
.modal-footer {
  background-color: var(--window);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--ui-border, #4b5563);
}
.remove-link-btn {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--danger, #dc2626);
  background: none;
  border: none;
  cursor: pointer;
}
.remove-link-btn:hover {
  color: var(--danger-hover, #991b1b);
  text-decoration: underline;
}
.flex.gap-3 {
  display: flex;
  gap: 0.75rem;
}
/* ** RE-STYLED CANCEL BUTTON ** */
.modal-btn-secondary {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: var(--writer-button-bar);
  color: var(--main-color);
  border-radius: 0;
  border: 1px solid var(--ui-border);
  cursor: pointer;
}
.modal-btn-secondary:hover {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}
.modal-btn-primary {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  background-color: var(--writer-button-bar);
  color: var(--accent-f);
  border-radius: 0;
  border: none;
  cursor: pointer;
}
.modal-btn-primary:hover {
  background-color: var(--button-hover);
  color: var(--button-hover-f);
}
.items-center {
  display: flex;
  align-items: center;
}
.ml-2 {
  margin-left: 0.5rem;
  font-size: 1rem;
}
.mt-4 {
  margin-top: 1rem;
  font-size: 1rem;
}
</style>
