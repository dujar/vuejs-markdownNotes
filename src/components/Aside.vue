<template>
  <div class="flex flex-col justify-center items-center items-stretch">
    <div
    class="flex flex-col sm:flex-row items-grow justify-start p-4 bg-grey shadow-lg">
      <div :class="notes[0]? 'flex-1 bg-orange-light shadow' : ''">
        <button
          :title="notes.length + 'note(s) already'"
          class="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded w-32"
          :class="notes? ' rounded-full t-50 l-50 te' : ' '"
          @click="addNote">
          Add note</button>

        <div
          v-for="(note) in sortedNotes"
          @click="selectNote(note)"
          :key="note.id"
          :class="note === selectedNote? 'bg-green' : ''"
          class=' text-white text-center font-bold border rounded m-2 w-auto hover:text-blue'
        >
          {{ note.title }}
          <span
            class="w-1 font-bold"
            v-if="note.favorite"><v-icon name="star" class="w-3 text-yellow"></v-icon></span>
        </div>
      </div>

      <template v-if="selectedNote">
        <div class="flex-2  m-4 flex-2 border-2 rounded p-2">
          <div class="flex-row flex justify-start flex-wrap">
            <span class="font-bold">Note title: </span>
            <input
              v-model="selectedNote.title"
              placeholder="Note title"
              class="w-32"
              >
            <button
              class="bg-blue-light rounded border-2 border-red"
              @click="favoriteNote">
              Favorite
              <v-icon
              name="star"
              class="w-3 text-yellow"/>
              </button>
            <button
              class="bg-red-light rounded border-blue border-2"
              @click="removeNote">remove note</button>
          </div>
          <span class="font-bold text-blue">write on markdow!</span>
          <textarea
            v-model="selectedNote.content"
            class="h-48 w-full  border-2 rounded shadow-inner" />
          <span>
            <span class="font-bold">
              Created
            </span>
            <span class="text-blue">
              {{ selectedNote.created | date }}
            </span>
          </span>
          <span>
            <span class="font-bold">
              Word Count:
            </span>
            <span class="text-blue">
              {{ wordsCount }}
            </span>
          </span>
          <span>
            <span class="font-bold">
              Character count:
            </span>
            <span class="text-blue">
              {{ charactersCount }}
            </span>
          </span>
          <span>
            <span class="font-bold">
              Line count:
            </span>
            <span class="text-blue">
              {{ linesCount }}
            </span>
          </span>
        </div>
        <div
          class="bg-white p-2 pre border-2 rounded border-blue m-4 flex-2"
          v-html="notePreview"/>
      </template>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  data() {
    return {
      notes: JSON.parse(localStorage.getItem('notes')) || [],
      selectedId: JSON.parse(localStorage.getItem('selected-id'))
    };
  },
  computed: {
    linesCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split(/\r\n|\r|\n/).length;
      }
    },
    wordsCount() {
      if (this.selectedNote) {
        var s = this.selectedNote.content;
        s = s.replace(/\n/g, ' ');
        s = s.replace(/(^\s*)|(\s*$)/gi, '');
        s = s.replace(/\s\s+/gi, ' ');
        return s.split(' ').length;
      }
    },
    charactersCount() {
      if (this.selectedNote) {
        return this.selectedNote.content.split('').length;
      }
    },
    sortedNotes() {
      return this.notes
        .slice()
        .sort((a, b) => a.created - b.created)
        .sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));
    },
    selectedNote() {
      return this.notes.find(note => note.id === this.selectedId);
    },
    notePreview() {
      return this.selectedNote ? marked(this.selectedNote.content) : '';
    }
  },
  watch: {
    notes: {
      handler: 'saveNotes',
      deep: true
    },
    selectedId(val) {
      localStorage.setItem('selected-id', val);
      console.log('selectedid saved', Date.now());
    }
  },
  methods: {
    favoriteNote() {
      this.selectedNote.favorite ^= true;
    },
    removeNote() {
      if (this.selectedNote && confirm('Delete the Note?')) {
        this.notes = this.notes.filter(
          note => note.title !== this.selectedNote.title
        );
      }
    },
    selectNote(note) {
      this.selectedId = note.id;
    },
    addNote() {
      const time = Date.now();
      const note = {
        id: String(time),
        title: 'New note' + (this.notes.length + 1),
        content:
          '**Hi!** This notebook is using [markdow](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
        created: time,
        favorite: false
      };
      this.notes.push(note);
    },
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
      console.log('notes saved!', new Date());
    }
  }
};
</script>
<style scoped>

</style>
