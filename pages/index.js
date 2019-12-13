import { validationMixin } from "vuelidate";
import { required, maxLength, numeric } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    name: { required, maxLength: maxLength(8), numeric }
  },

  data: () => ({
    name: "",
    methods: ["FUT1", "FUT2"],
    selectedMethods: [],
    file1: null,
    file2: null,
    file3: null,
    gene1: "",
    gene2: "",
    gene3: "",
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
      }

      if (this.selectedMethods.includes(this.methods[1])) {
        if (this.file2) {
          bool2 = true;
        } else {
          bool2 = false;
        }
      } else {
        bool2 = true;
      }

      if (this.selectedMethods.includes(this.methods[2])) {
        if (this.file3) {
          bool3 = true;
        } else {
          bool3 = false;
        }
      } else {
        bool3 = true;
      }

      return bool1 && bool2 && bool3 && this.name.length > 0;
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
      this.file1 = null;
      this.file2 = null;
      this.file3 = null;
    },
    input(model) {
      const reader = new FileReader();
      reader.onload = e => {
        let file = e.target.result.split(/\n/gi);
        file.shift();
        file = file.join("");
        let data = "gene" + model[model.length - 1];
        this[data] = file;
        console.log(this[data]);
      };

      if (this[model]) reader.readAsText(this[model]);
    },
    genotyping() {
      this.overlay = true;
      // API request
      this.gene1 =
        "ATGTGGCTCCGGAGCCATCGTCAGCTCTGCCTGGCCTTCCTGCTAGTCTGTGTCCTCTCTGTAATCTTCTTCCTCCATATCCATCAAGACAGCTTTCCACATGGCCTAGGCCTGTCGATCCTGTGTCCAGACCGCCGCCTGGTGACACCCCCAGTGGCCATCTTCTGCCTGCCGGGTACTGCGATGGGCCCCAACGCCTCCTCTTCCTGTCCCCAGCACCCTGCTTCCCTCTCCGGCACCTGGACTGTCTACCCCAATGGCCGGTTTGGTAATCAGATGGGACAGTATGCCATGCTGCTGGCTCTGGCCCAGCTCAACGGCCGCCGGGCCTTTATCCTGCCTGCCATGCATGCCGCCCTGGCCCCGGTATTCCGCATCACCCTGCCCGTGCTGGCCCCAGAAGTGGACAGCCGCACGCCGTGGCGGGAGCTGCAGCTTCACGACTGGATGTCGGAGGAGTACGCGGACTTGAGAGATCCTTTCCTGAAGCTCTCTGGCTTCCCCTGCTCTTGGACTTTCTTCCACCATCTCCGGGAACAGATCCGCAGAGAGTTCACCCTGCACGACCACCTTCGGGAAGAGGCGCAGAGTGTGCTGGGTCAGCTCCGCCTGGGCCGCACAGGGGACCGCCCGCGCACCTTTGTCGGCGTCCACGTGCGCCGTGGGGACTATCTGCAGGTTATGCCTCAGCGCTGGAAGGGTGTGGTGGGCGACAGCGCCTACCTCCGGCAGGCCATGGACTGGTTCCGGGCACGGCACGAAGCCCCCGTTTTCGTGGTCACCAGCAACGGCATGGAGTGGTGTAAAGAAAACATCGACACCTCCCAGGGCGATGTGACGTTTGCTGGCGATGGACAGGAGGCTACACCGTGGAAAGACTTTGCCCTGCTCACACAGTGCAACCACACCATTATGACCATTGGCACCTTCGGCTTCTGGGCTGCCTACCTGGCTGGCGGAGACACTGTCTACCTGGCCAACTTCACCCTGCCAGACTCTGAGTTCCTGAAGATCTTTAAGCCGGAGGCGGCCTTCCTGCCCGAGTGGGTGGGCATTAATGCAGACTTGTCTCCACTCTGGACATTGGCTAAGCCTTGA";
      this.$axios.defaults.baseURL = "https://mt-cmu-2019.appspot.com";
      this.$axios
        .post(
          "/api/v1/diagnosis/calculate",
          {
            method: "FUT1",
            geneSequence: this.gene1,
            patientID: this.name,
            noSave: false
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
          this.dialog = true;
        });
    }
  }
};