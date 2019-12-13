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
                  <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
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

<script src="./index.js">
</script>
