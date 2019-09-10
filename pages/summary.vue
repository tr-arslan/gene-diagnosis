<template>
  <v-card>
    <v-card-title>
      Summary
      <div class="flex-grow-1"></div>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="data" :search="search">
      <template v-slot:item.download="{ item }">
        <v-icon small class="mr-2" @click="download(item.patientID, item.method)">mdi-download</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "PatientID",
          align: "left",
          sortable: false,
          value: "patientID"
        },
        { text: "Method", value: "method" },
        { text: "AlleleName", value: "mutationRefMatch.alleleName" },
        { text: "Phenotype", value: "mutationRefMatch.phenotype" },
        {
          text: "NucleotideChange",
          value: "mutationResult[0].position"
        },
        {
          text: "Download",
          value: "download",
          sortable: false,
          align: "center"
        }
      ],
      data: []
    };
  },
  methods: {
    getData() {
      // API request
      this.$axios.defaults.baseURL = "https://mt-cmu-2019.appspot.com";
      this.$axios
        .get("/api/v1/diagnosis/list?skip=0&limit=0")
        .then(res => {
          console.log(res);
          this.data = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    download(id, gene) {
      alert(`Download: PatientID ${id}, ${gene} sequence\nComing Soon.`)
    }
  },
  mounted() {
    this.getData();
  }
};
</script>