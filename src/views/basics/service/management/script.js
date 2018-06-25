import subscription from './subscription/index'
import publication from './publication/index'
import checked from './checked/index'
import forbidden from './forbidden/index'

export default {
  name: 'pageManagement',
  components: {
    subscription,
    publication,
    checked,
    forbidden
  },
  data() {
    return {
      listId: subscription,
      isActive1: true,
      isActive2: false,
      isActive3: false,
      isActive4: false
    }
  },
  methods: {
    
    goSubscription() {
      this.listId = subscription
      this.isActive1 = true
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = false
    },
    goPublication() {
      this.listId = publication
      this.isActive1 = false
      this.isActive2 = true
      this.isActive3 = false
      this.isActive4 = false
    },
    goChecked() {
      this.listId = checked
      this.isActive1 = false
      this.isActive2 = false
      this.isActive3 = true
      this.isActive4 = false
    },
    goForbidden() {
      this.listId = forbidden
      this.isActive1 = false
      this.isActive2 = false
      this.isActive3 = false
      this.isActive4 = true
    }
  }
}
