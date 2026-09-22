import { Link } from "react-router-dom";
import Container from "../Container";
import SectionTitle from "../SectionTitle";
import MenuItem from "../menu/MenuItem";
import { menuItems } from "../../data/menuData";

export default function FeaturedMenu() {
  const popularItems = menuItems.filter(
    (item) => item.isPopular
  );

  const handleAdd = (item) => {
    console.log("Add to cart:", item);
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>

        <SectionTitle
          subtitle="Our Menu"
          title="Customer Favorites"
          description="Discover some of our most loved dishes."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popularItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              onAdd={handleAdd}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-500 hover:text-amber-500"
          >
            View Full Menu
          </Link>
        </div>

      </Container>
    </section>
  );
}