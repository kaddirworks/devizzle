import React from "react";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Title from "../components/elements/title";
import Text from "../components/elements/text";
import Footer from "../components/footer";

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Title>How it Works</Title>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae,
            tenetur? Quibusdam eos molestias sed dignissimos, aspernatur eum
            maxime veritatis hic, ratione in fugit, earum et aliquam blanditiis
            iste sequi assumenda?
          </Text>
          <Text>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam
            nesciunt labore architecto non necessitatibus, dolore veniam nulla
            quidem odit, nam voluptatum? Possimus laborum quidem perferendis
            totam iure, numquam porro accusantium. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Minima voluptates minus ut quasi quia
            ducimus sunt? Magnam maiores asperiores accusantium impedit officiis
            quasi numquam eligendi quae veritatis. Id, velit fugit.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            aliquam eius doloribus cupiditate aut nemo ipsum ducimus vitae
            delectus consequuntur, modi amet fugit! Itaque, architecto! Incidunt
            fugiat adipisci eum dolorum?
          </Text>
          <Text>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat
            quos mollitia autem? Repellendus, obcaecati eveniet. Eligendi quam
            molestiae quidem atque excepturi iusto consequuntur, facere fuga
            asperiores velit magni similique ut? Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Blanditiis, veniam. Tempora adipisci
            dolorum consectetur aliquam eius, sint cumque labore repellat
            distinctio nihil quam accusamus, placeat, natus vitae quisquam illo
            molestias. Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Modi consequuntur explicabo vero ipsum nam inventore labore!
            Voluptate ipsa sed expedita doloremque architecto quia, qui
            voluptates, eveniet, totam facere maiores incidunt.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum
            debitis voluptatibus ipsam similique impedit enim officia corrupti,
            nemo libero id vero incidunt minima tempora quia perspiciatis, illo
            eos ab asperiores. Lorem, ipsum dolor sit amet consectetur
            adipisicing elit. Nesciunt dolores reprehenderit fugit vero expedita
            neque alias quasi quos architecto! Aut saepe consequatur nesciunt
            accusantium illo deleniti exercitationem voluptatem impedit? Et.
          </Text>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default HowItWorks;
