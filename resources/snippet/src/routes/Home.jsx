import React from "react";

class Home extends React.Component {
  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <>
        <section class="hero is-large is-info">
          <div class="hero-body">
            <p class="title">Devizzle</p>
            <p class="subtitle">Send your message to the world.</p>
          </div>
        </section>

        <div className="container">
          <div className="content">
            <section className="section">
              <h1>Home</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
                debitis inventore dolor mollitia magnam, nulla soluta quis iste
                praesentium reiciendis dignissimos dolorum minus veritatis
                impedit beatae atque voluptate porro aliquid?
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, reprehenderit. Sequi, maiores numquam repudiandae
                repellat nulla possimus quibusdam consectetur exercitationem,
                optio dolorem, ea quia officiis inventore nostrum incidunt et
                ab? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id
                iste deserunt sequi nobis illum iusto cum perferendis, in
                praesentium vero repellat nemo reprehenderit at officiis ea
                neque voluptatem molestias aspernatur?
              </p>
            </section>
          </div>
        </div>
      </>
    );
  }
}
export default Home;
