var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data:	{
  	total: 0,
  	items: [],
  	cart: [],
  	results: [],
  	search: '90s',
  	lastSearch: '',
  	loading: false,
  	price: PRICE
  },
  methods: {
  	appendItems: function() {
  		if (this.items.length < this.results.length) {
  			var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
  			this.items = this.items.concat(append);
  		}
  	},
  	onSubmit: function() {
  		if (this.search.length) {
	  		this.loading = true;
	  		this.$http.get('/search/'.concat(this.search))
	  			.then(function(res) {
	  				this.loading = false;
	  				this.lastSearch = this.search;
	  				this.results = res.data;
	  				this.appendItems();
	  			});
  		}
  	},
  	addItem: function(index) {
  		var item = this.items[index];
  		this.total += PRICE;
  		var found = false;
  		for (var i = 0; i < this.cart.length; i++) {
  			if (this.cart[i].id === item.id) {
  				this.cart[i].qty++;
  				found = true;
  				break;
  			}
  		}
  		if (!found) {
	  		this.cart.push({
	  			id: item.id,
	  			title: item.title,
	  			qty: 1,
	  			price: PRICE
	  		});
  		}
  	},
  	incrementQuantity: function(item) {
  		item.qty++;
  		this.total += item.price;
  	},
  	decrementQuantity: function(item) {
  		item.qty--;
  		this.total -= item.price;
  		if (item.qty < 1) {
  			for (var i = 0; i < this.cart.length; i++) {
  				if (this.cart[i].id === item.id) {
  					this.cart.splice(i, 1);
  					break;
  				}
  			}
  		}
  	}
  },
  computed: {
  	noMoreItems: function() {
  		return this.items.length === this.results.length && this.results.length > 0;
  	}
  },
  filters: {
  	currency: function(price) {
  		return '$'.concat(price.toFixed(2));
  	}
  },
  mounted: function() {
  	this.onSubmit();

  	var vueInstance = this;
  	var elem = document.getElementById('product-list-bottom');
 	var watcher = scrollMonitor.create(elem);
	watcher.enterViewport(function() {
		vueInstance.appendItems();
	});
  }
});

