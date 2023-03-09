import React from "react";

import Navbar from "../components/navbar";
import Container from "../components/container";
import Title from "../components/elements/title";
import Text from "../components/elements/text";
import Footer from "../components/footer";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Title>Home</Title>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            debitis inventore dolor mollitia magnam, nulla soluta quis iste
            praesentium reiciendis dignissimos dolorum minus veritatis impedit
            beatae atque voluptate porro aliquid?
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            reprehenderit. Sequi, maiores numquam repudiandae repellat nulla
            possimus quibusdam consectetur exercitationem, optio dolorem, ea
            quia officiis inventore nostrum incidunt et ab? Lorem ipsum, dolor
            sit amet consectetur adipisicing elit. Id iste deserunt sequi nobis
            illum iusto cum perferendis, in praesentium vero repellat nemo
            reprehenderit at officiis ea neque voluptatem molestias aspernatur?
          </Text>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Home;
