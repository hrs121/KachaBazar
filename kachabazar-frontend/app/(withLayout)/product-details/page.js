export default function ProductDetailsPage() {
    return (
      <div>
        {/* Breadcrumb Section */}
        <section className="bg-cover bg-center py-12" style={{ backgroundImage: 'url(/img/breadcrumb.jpg)' }}>
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-2">Vegetable’s Package</h2>
            <div className="text-white space-x-2">
              <a href="/" className="hover:underline">Home</a>
              <span>/</span>
              <a href="/" className="hover:underline">Vegetables</a>
              <span>/</span>
              <span>Vegetable’s Package</span>
            </div>
          </div>
        </section>
  
        {/* Product Details Section */}
        <section className="py-12">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src="/img/product/details/product-details-1.jpg" alt="" className="w-full rounded-lg mb-4" />
              <div className="flex gap-2 overflow-x-auto">
                {[2, 3, 5, 4].map(i => (
                  <img
                    key={i}
                    src={`/img/product/details/thumb-${i - 1}.jpg`}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-semibold mb-2">Vegetable’s Package</h3>
              <div className="flex items-center mb-2">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className="fa fa-star text-yellow-400"></i>
                ))}
                <i className="fa fa-star-half-o text-yellow-400"></i>
                <span className="ml-2 text-sm text-gray-600">(18 reviews)</span>
              </div>
              <div className="text-2xl text-green-600 font-bold mb-4">$50.00</div>
              <p className="text-gray-700 mb-4">
                Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac diam sit amet quam
                vehicula elementum sed sit amet dui. Sed porttitor lectus nibh.
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <input
                  type="number"
                  defaultValue="1"
                  className="w-16 border border-gray-300 rounded text-center py-1"
                />
                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">ADD TO CART</button>
                <button className="text-gray-500 hover:text-red-500">
                  <span className="icon_heart_alt"></span>
                </button>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>Availability:</strong> In Stock</li>
                <li><strong>Shipping:</strong> 01 day shipping. <span className="text-green-600">Free pickup today</span></li>
                <li><strong>Weight:</strong> 0.5 kg</li>
                <li className="flex items-center space-x-2">
                  <strong>Share on:</strong>
                  <a href="#"><i className="fa fa-facebook"></i></a>
                  <a href="#"><i className="fa fa-twitter"></i></a>
                  <a href="#"><i className="fa fa-instagram"></i></a>
                  <a href="#"><i className="fa fa-pinterest"></i></a>
                </li>
              </ul>
            </div>
          </div>
        </section>
  
        {/* Tabs Section */}
        <section className="container mx-auto py-12">
          <div>
            <div className="flex space-x-4  mb-4">
              <button className="py-2 px-4 border-b-2 border-green-600 font-semibold">Description</button>
              <button className="py-2 px-4 text-gray-600">Information</button>
              <button className="py-2 px-4 text-gray-600">Reviews (1)</button>
            </div>
            <div>
              <h6 className="text-lg font-semibold mb-2">Product Information</h6>
              <p className="text-gray-700 mb-4">
                Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus.
              </p>
              <p className="text-gray-700">
                Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </section>
  
        {/* Related Products Section */}
        <section className=" py-12">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 7].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(/img/product/product-${i}.jpg)` }}
                  >
                    <ul className="flex justify-end p-2 space-x-2 text-white">
                      <li><a href="#"><i className="fa fa-heart"></i></a></li>
                      <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                      <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <h6 className="font-semibold mb-1"><a href="#">Crab Pool Security</a></h6>
                    <h5 className="text-green-600 font-bold">$30.00</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }