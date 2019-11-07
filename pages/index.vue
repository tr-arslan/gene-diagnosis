<template>
  <v-layout row justify-center align-center>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-flex xs12 sm8 md4>
      <v-card class="pa-2 pb-1 mt-5">
        <form>
          <v-text-field
            class="px-4"
            v-model="name"
            :error-messages="nameErrors"
            :counter="8"
            label="ID"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
        </form>
        <v-col cols="12" sm="6" md="12">
          <v-select
            v-model="selectedMethods"
            :items="methods"
            chips
            label="Methods"
            multiple
            outlined
          ></v-select>
        </v-col>

        <v-card-text class="px-4" v-if="selectedMethods.length > 0">Sequence Input</v-card-text>

        <v-expansion-panels class="px-4">
          <v-expansion-panel v-if="selectedMethods.includes(methods[0])">
            <v-expansion-panel-header :disable-icon-rotate="file1!=null">
              {{methods[0]}}
              <template v-slot:actions>
                <v-icon v-if="!file1" color="primary">$vuetify.icons.expand</v-icon>
                <v-icon v-else-if="error1" color="error">mdi-alert-circle</v-icon>
                <v-icon v-else color="teal">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-file-input
                v-model="file1"
                color="deep-purple accent-4"
                counter
                placeholder="Select your file"
                prepend-icon="mdi-clippy"
                outlined
                :show-size="1000"
                @change="input('file1')"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >+{{ files.length - 2 }} File</span>
                </template>
              </v-file-input>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel v-if="selectedMethods.includes(methods[1])">
            <v-expansion-panel-header :disable-icon-rotate="file2!=null">
              {{methods[1]}}
              <template v-slot:actions>
                <v-icon v-if="!file2" color="primary">$vuetify.icons.expand</v-icon>
                <v-icon v-else-if="error2" color="error">mdi-alert-circle</v-icon>
                <v-icon v-else color="teal">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-file-input
                v-model="file2"
                color="deep-purple accent-4"
                counter
                placeholder="Select your file"
                prepend-icon="mdi-clippy"
                outlined
                @change="input('file2')"
                :show-size="1000"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >+{{ files.length - 2 }} File</span>
                </template>
              </v-file-input>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel v-if="selectedMethods.includes(methods[2])">
            <v-expansion-panel-header :disable-icon-rotate="file3!=null">
              {{methods[2]}}
              <template v-slot:actions>
                <v-icon v-if="!file3" color="primary">$vuetify.icons.expand</v-icon>
                <v-icon v-else-if="error3" color="error">mdi-alert-circle</v-icon>
                <v-icon v-else color="teal">mdi-check</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-file-input
                v-model="file3"
                color="deep-purple accent-4"
                counter
                placeholder="Select your file"
                prepend-icon="mdi-clippy"
                @change="input('file3')"
                outlined
                :show-size="1000"
              >
                <template v-slot:selection="{ index, text }">
                  <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>{{ text }}</v-chip>

                  <span
                    v-else-if="index === 2"
                    class="overline grey--text text--darken-3 mx-2"
                  >+{{ files.length - 2 }} File</span>
                </template>
              </v-file-input>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card-actions class="mt-4">
          <v-spacer />
          <template>
            <v-dialog v-model="dialog" persistent max-width="400">
              <template v-slot:activator="{ on }">
                <v-btn
                  @click="genotyping()"
                  :disabled="!completeDetail"
                  color="green white--text"
                >Test</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline">
                  Result
                  <br />
                  <v-spacer />
                  <small
                    style="font-size:10px"
                    class="grey--text"
                  >on {{new Date().toLocaleString()}}</small>
                </v-card-title>
                <!-- FUT1 -->
                <v-card-text>
                  <p>
                    <span class="font-weight-bold">Method:</span>
                    {{data.method}}
                  </p>
                  <p>
                    <span class="font-weight-bold">Start position:</span>
                    {{data.lcsStartAt}}
                  </p>
                  <p>
                    <span class="font-weight-bold">End position:</span>
                    {{data.lcsEndAt}}
                  </p>
                  <p v-if="data.mutationResult">
                    <span class="font-weight-bold">MutationResult:</span>
                    {{data.mutationResult[0].type+data.mutationResult[0].position+data.mutationResult[0].changeFrom+'>'+data.mutationResult[0].changeTo}}
                  </p>
                  <p v-if="data.mutationRefMatch">
                    <span class="font-weight-bold">MutationMatch:</span>
                    AlleleName {{data.mutationRefMatch.alleleName}}
                  </p>
                  <v-divider />
                </v-card-text>
                <!-- FUT2 -->
                <v-card-text v-if="selectedMethods.includes(methods[1])">
                  <p>
                    <span class="font-weight-bold">Method:</span>
                    {{methods[1]}}
                  </p>
                  <p>
                    <span class="font-weight-bold">Start position:</span>
                    {{data.lcsStartAt}}
                  </p>
                  <p>
                    <span class="font-weight-bold">End position:</span>
                    {{data.lcsEndAt}}
                  </p>
                  <p v-if="data.mutationResult">
                    <span class="font-weight-bold">MutationResult:</span>
                    {{data.mutationResult[0].type+data.mutationResult[0].position+data.mutationResult[0].changeFrom+'>'+data.mutationResult[0].changeTo}}
                  </p>
                  <p v-if="data.mutationRefMatch">
                    <span class="font-weight-bold">MutationMatch:</span>
                    AlleleName {{data.mutationRefMatch.alleleName}}
                  </p>
                  <v-divider />
                </v-card-text>
                <!-- ABO -->
                <v-card-text v-if="selectedMethods.includes(methods[2])">
                  <p>
                    <span class="font-weight-bold">Method:</span>
                    {{methods[2]}}
                  </p>
                  <p>
                    <span class="font-weight-bold">Start position:</span>
                    {{data.lcsStartAt}}
                  </p>
                  <p>
                    <span class="font-weight-bold">End position:</span>
                    {{data.lcsEndAt}}
                  </p>
                  <p v-if="data.mutationResult">
                    <span class="font-weight-bold">MutationResult:</span>
                    {{data.mutationResult[0].type+data.mutationResult[0].position+data.mutationResult[0].changeFrom+'>'+data.mutationResult[0].changeTo}}
                  </p>
                  <p v-if="data.mutationRefMatch">
                    <span class="font-weight-bold">MutationMatch:</span>
                    AlleleName {{data.mutationRefMatch.alleleName}}
                  </p>
                </v-card-text>
                <v-card-actions>
                  <div class="flex-grow-1"></div>
                  <v-btn color="green darken-1" text @click="dialog = false">Finish and Close</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>

          <v-btn @click="clear()">Clear</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
  </v-layout>
  
</template>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(8), numeric }
  },

  data: () => ({
    name: "",
    methods: ["FUT1", "FUT2", "ABO"],
    selectedMethods: [],
    file1: null,
    file2: null,
    file3: null,
    gene1: "",
    gene2: "",
    gene3: "",
    error1: false,
    error2: false,
    error3: false,
    dialog: false,
    data: {},
    overlay: false
  }),

  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength &&
        errors.push("Name must be at most 8 characters long");
      !this.$v.name.required && errors.push("ID is required.");
      !this.$v.name.numeric && errors.push("ID must contain only numbers.");
      return errors;
    },
    completeDetail() {
      console.log("validating...");
      let bool1 = false,
        bool2 = false,
        bool3 = false;
      if (this.selectedMethods.length == 0) return false;
      if (this.selectedMethods.includes(this.methods[0])) {
        if (this.file1) {
          bool1 = true;
        } else {
          bool1 = false;
        }
      } else {
        bool1 = true;
        this.error1 = false;
      }

      if (this.selectedMethods.includes(this.methods[1])) {
        if (this.file2) {
          bool2 = true;
        } else {
          bool2 = false;
        }
      } else {
        bool2 = true;
        this.error2 = false;
      }

      if (this.selectedMethods.includes(this.methods[2])) {
        if (this.file3) {
          bool3 = true;
        } else {
          bool3 = false;
        }
      } else {
        bool3 = true;
        this.error3 = false;
      }

      return (
        bool1 &&
        bool2 &&
        bool3 &&
        this.name.length > 0 &&
        !this.error1 &&
        !this.error2 &&
        !this.error3
      );
    }
  },

  methods: {
    submit() {
      this.$v.$touch();
    },
    clear() {
      this.$v.$reset();
      this.name = "";
      this.selectedMethods = [];
      this.file1 = undefined;
      this.file2 = undefined;
      this.file3 = undefined;
    },
    input(model) {
      const reader = new FileReader();
      reader.onload = e => {
        let file = e.target.result.split(/\n/gi);
        file.shift();
        file = file.join("");
        let data = "gene" + model[model.length - 1];
        file = file.replace(/\s+/g, "");
        this[data] = file;
        console.log(this.methods[model[model.length - 1] - 1]);
        this.$axios.defaults.baseURL = "https://mt-cmu-2019.appspot.com";
        this.$axios
          .post(
            "/api/v1/diagnosis/method-validataion",
            {
              method: this.methods[model[model.length - 1] - 1],
              geneSequence: this[data]
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          )
          .then(res => {
            let err = "error" + model[model.length - 1];
            if (!res.data) {
              this[err] = true;
            } else {
              this[err] = false;
            }
          })
          .catch(error => {
            this[err] = true;
          });
        console.log(data, this[data]);
      };

      if (this[model]) reader.readAsText(this[model]);
    },
    genotyping() {
      this.overlay = true;
      // API request
      // this.gene1 =
      //   "ATGTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCATGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTTGA";
      this.$axios.defaults.baseURL = "https://mt-cmu-2019.appspot.com";
      if (this.gene1) {
        this.$axios
          .post(
            "/api/v1/diagnosis/calculate",
            {
              method: "FUT1",
              geneSequence: this.gene1,
              patientID: this.name,
              noSave: false,
              type: "file"
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          )
          .then(res => {
            console.log(res);
            this.data = res.data;
            this.overlay = false;
            this.dialog = true;
          })
          .catch(error => {
            console.log(error);
            this.overlay = false;
            this.dialog = true;
          });
      }
      if (this.gene2) {
        this.$axios
          .post(
            "/api/v1/diagnosis/calculate",
            {
              method: "FUT2",
              geneSequence: this.gene2,
              patientID: this.name,
              noSave: false,
              type: "file"
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          )
          .then(res => {
            console.log(res);
            this.data = res.data;
            this.overlay = false;
            this.dialog = true;
          })
          .catch(error => {
            console.log(error);
            this.overlay = false;
            this.dialog = true;
          });
      }
      if (this.gene3) {
        this.$axios
          .post(
            "/api/v1/diagnosis/calculate",
            {
              method: "ABO",
              geneSequence: this.gene3,
              patientID: this.name,
              noSave: false,
              type: "file"
            },
            {
              headers: { "Content-Type": "application/json" }
            }
          )
          .then(res => {
            console.log(res);
            this.data = res.data;
            this.overlay = false;
            this.dialog = true;
          })
          .catch(error => {
            console.log(error);
            this.overlay = false;
            this.dialog = true;
          });
      }
    }
  }
  // watch: {
  //   selectedMethods() {
  //     console.log(this.selectedMethods);
  //   }
  // }
};
</script>
