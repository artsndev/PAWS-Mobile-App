/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Components
import * as components from 'vuetify/components';

// Labs
import { VDateInput } from 'vuetify/labs/VDateInput';

// Composables
import { createVuetify } from 'vuetify'

const customTheme = {
  colors: {
    primary: '#1565C0',
    dark: '#212121'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    ...components,
    VDateInput
  },
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme,
    }
  },
})
