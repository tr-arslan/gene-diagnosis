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
      <template v-slot:item.change="{ item }">{{
        item.mutationResult[0]
          ? item.mutationResult[0].type +
            item.mutationResult[0].position +
            item.mutationResult[0].changeFrom +
            ">" +
            item.mutationResult[0].changeTo
          : "-"
      }}</template>
      <template v-slot:item.fileName="{ item }">{{
        item.fileName.includes("_")
          ? new Date(
              +item.fileName.split("_")[2].split(".")[0]
            ).toLocaleString()
          : "nodata"
      }}</template>
      <template v-slot:item.allelename="{ item }">{{
        item.mutationRefMatch ? item.mutationRefMatch.alleleName : "-"
      }}</template>

      <template v-slot:item.phenotype="{ item }">{{
        item.mutationRefMatch ? item.mutationRefMatch.phenotype : "-"
      }}</template>

      <template v-slot:item.download="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="
            download(item.patientID, item.method, item._id, item.fileName)
          "
          >mdi-download</v-icon
        >
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
        {
          text: "IssueDate",
          value: "fileName"
        },
        { text: "Method", value: "method" },
        { text: "AlleleName", value: "allelename" },
        { text: "Phenotype", value: "phenotype" },
        {
          text: "NucleotideChange",
          value: "change"
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
          this.data.reverse();
        })
        .catch(error => {
          console.log(error);
        });
    },
    download(pid, gene, test_id, name) {
      // alert(`Download: PatientID ${pid}, ${gene}, ${test_id} sequence\nComing Soon.`)
      this.$axios.defaults.baseURL = "https://mt-cmu-2019.appspot.com";
      this.$axios
        .get(`/api/v1/diagnosis/download?diagnosisLogID=${test_id}`)
        .then(res => {
          console.log(res);
          var saveData = (function() {
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            console.log("disp");
            return function(data, fileName) {
              var json = JSON.stringify(data)
                  .replace(/(?:\\[rn]|[\r\n]+)+/g, "\n")
                  .replace(/"/g, ""),
                blob = new Blob([json], { type: "octet/stream" }),
                url = window.URL.createObjectURL(blob);
              console.log(blob);

              a.href = url;
              a.download = fileName;
              a.click();
              window.URL.revokeObjectURL(url);
            };
          })();

          var data = res.data;

          saveData(data, name);
        })
        .catch(error => {
          console.log("The file is broken, please contact staff");
        });
    },
    add1(string) {
      return string + 1;
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
