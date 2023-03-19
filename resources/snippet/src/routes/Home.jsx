import React from "react";

import { Link } from "react-router-dom";

class Home extends React.Component {
  constructor({ props }) {
    super(props);
  }

  render() {
    return (
      <>
        <section class="hero is-large is-link">
          <div class="hero-body">
            <p class="title">Devizzle</p>
            <p class="subtitle">Send your message to the world.</p>
            <a className="button is-primary" href="#how-it-works">
              Learn More
            </a>
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
            <section className="section" id="how-it-works">
              <h2>How it Works</h2>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam
                nesciunt labore architecto non necessitatibus, dolore veniam
                nulla quidem odit, nam voluptatum? Possimus laborum quidem
                perferendis totam iure, numquam porro accusantium. Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Minima voluptates
                minus ut quasi quia ducimus sunt? Magnam maiores asperiores
                accusantium impedit officiis quasi numquam eligendi quae
                veritatis. Id, velit fugit.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt aliquam eius doloribus cupiditate aut nemo ipsum
                ducimus vitae delectus consequuntur, modi amet fugit! Itaque,
                architecto! Incidunt fugiat adipisci eum dolorum?
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat
                quos mollitia autem? Repellendus, obcaecati eveniet. Eligendi
                quam molestiae quidem atque excepturi iusto consequuntur, facere
                fuga asperiores velit magni similique ut? Lorem ipsum dolor sit
                amet, consectetur adipisicing elit. Blanditiis, veniam. Tempora
                adipisci dolorum consectetur aliquam eius, sint cumque labore
                repellat distinctio nihil quam accusamus, placeat, natus vitae
                quisquam illo molestias. Lorem ipsum dolor, sit amet consectetur
                adipisicing elit. Modi consequuntur explicabo vero ipsum nam
                inventore labore! Voluptate ipsa sed expedita doloremque
                architecto quia, qui voluptates, eveniet, totam facere maiores
                incidunt.
              </p>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum
                debitis voluptatibus ipsam similique impedit enim officia
                corrupti, nemo libero id vero incidunt minima tempora quia
                perspiciatis, illo eos ab asperiores. Lorem, ipsum dolor sit
                amet consectetur adipisicing elit. Nesciunt dolores
                reprehenderit fugit vero expedita neque alias quasi quos
                architecto! Aut saepe consequatur nesciunt accusantium illo
                deleniti exercitationem voluptatem impedit? Et.
              </p>
            </section>
          </div>
        </div>
      </>
    );
  }
}
export default Home;
