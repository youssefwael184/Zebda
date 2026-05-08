const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PLAYERS_BATCH = [
  // ─── EASY (40 PLAYERS) ───────────────────────────────────
  {
    name: 'Lionel Messi', nationality: 'Argentina', position: 'Forward', club: 'Inter Miami', league: 'MLS', birthYear: 1987, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Record 8-time Ballon d\'Or winner.', 'Led Argentina to the 2022 World Cup trophy.', 'Spent the majority of his career at FC Barcelona.', 'Known as "La Pulga".']
  },
  {
    name: 'Cristiano Ronaldo', nationality: 'Portugal', position: 'Forward', club: 'Al Nassr', league: 'Saudi Pro League', birthYear: 1985, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['All-time leading goalscorer in international football.', 'Won 5 UEFA Champions League titles.', 'Famous for his "Siuuu" celebration.', 'Played for Man Utd, Real Madrid, and Juventus.']
  },
  {
    name: 'Kylian Mbappe', nationality: 'France', position: 'Forward', club: 'Real Madrid', league: 'La Liga', birthYear: 1998, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['Scored a hat-trick in the 2022 World Cup Final.', 'Joined Real Madrid in 2024.', 'PSG\'s all-time record goalscorer.', 'Won the World Cup at age 19 in 2018.']
  },
  {
    name: 'Erling Haaland', nationality: 'Norway', position: 'Striker', club: 'Manchester City', league: 'Premier League', birthYear: 2000, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['Broke the record for most goals in a single PL season.', 'Born in Leeds, England.', 'Won the Treble with Manchester City in 2023.', 'Nickname is "The Terminator".']
  },
  {
    name: 'Jude Bellingham', nationality: 'England', position: 'Midfielder', club: 'Real Madrid', league: 'La Liga', birthYear: 2003, jerseyNumber: 5, difficulty: 'EASY',
    hints: ['Wears the iconic number 5 at Real Madrid.', 'Started his career at Birmingham City.', 'Won La Liga Player of the Season in his debut year.', 'Scored in his first El Clasico.']
  },
  {
    name: 'Mohamed Salah', nationality: 'Egypt', position: 'Forward', club: 'Liverpool', league: 'Premier League', birthYear: 1992, jerseyNumber: 11, difficulty: 'EASY',
    hints: ['The "Egyptian King" of Anfield.', 'Holds the record for most left-footed goals in PL history.', 'Won the PL Golden Boot three times.', 'Previously played for Roma and Chelsea.']
  },
  {
    name: 'Kevin De Bruyne', nationality: 'Belgium', position: 'Midfielder', club: 'Manchester City', league: 'Premier League', birthYear: 1991, jerseyNumber: 17, difficulty: 'EASY',
    hints: ['Famous for his "Let me talk!" outburst.', 'Arguably the greatest passer in PL history.', 'Twice named PFA Player of the Year.', 'Signed from Wolfsburg in 2015.']
  },
  {
    name: 'Vinicius Junior', nationality: 'Brazil', position: 'Forward', club: 'Real Madrid', league: 'La Liga', birthYear: 2000, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['Scored the winning goal in the 2022 UCL Final.', 'Known for his incredible dribbling and pace.', 'Inherited the number 7 from Eden Hazard.', 'Signed from Flamengo as a teenager.']
  },
  {
    name: 'Robert Lewandowski', nationality: 'Poland', position: 'Striker', club: 'Barcelona', league: 'La Liga', birthYear: 1988, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['Scored 5 goals in 9 minutes for Bayern Munich.', 'Won the sextuple with Bayern in 2020.', 'Poland\'s all-time leading scorer.', 'Joined Barcelona in 2022.']
  },
  {
    name: 'Harry Kane', nationality: 'England', position: 'Striker', club: 'Bayern Munich', league: 'Bundesliga', birthYear: 1993, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['England\'s all-time record goalscorer.', 'Tottenham Hotspur\'s record goalscorer.', 'Left the Premier League in 2023 for Germany.', 'Won the Golden Boot at the 2018 World Cup.']
  },
  {
    name: 'Bukayo Saka', nationality: 'England', position: 'Forward', club: 'Arsenal', league: 'Premier League', birthYear: 2001, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['Arsenal\'s "Starboy".', 'Made his debut as a left-back before becoming a winger.', 'Has won England Men\'s Player of the Year twice.', 'Wears the number 7 at the Emirates.']
  },
  {
    name: 'Neymar Jr', nationality: 'Brazil', position: 'Forward', club: 'Al Hilal', league: 'Saudi Pro League', birthYear: 1992, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['The most expensive player in football history (222m euros).', 'Part of the famous "MSN" trio.', 'Brazil\'s all-time leading goalscorer.', 'Began his career at Santos.']
  },
  {
    name: 'Luka Modric', nationality: 'Croatia', position: 'Midfielder', club: 'Real Madrid', league: 'La Liga', birthYear: 1985, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Won the Ballon d\'Or in 2018.', 'Led Croatia to a World Cup Final and Semi-final.', 'A master of the "Trivela" (outside of foot) pass.', 'Joined Madrid from Tottenham in 2012.']
  },
  {
    name: 'Son Heung-min', nationality: 'South Korea', position: 'Forward', club: 'Tottenham', league: 'Premier League', birthYear: 1992, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['First Asian player to win the PL Golden Boot.', 'Famous for his "camera" goal celebration.', 'Captain of both his club and country.', 'Won the Puskas Award for a solo goal vs Burnley.']
  },
  {
    name: 'Virgil van Dijk', nationality: 'Netherlands', position: 'Defender', club: 'Liverpool', league: 'Premier League', birthYear: 1991, jerseyNumber: 4, difficulty: 'EASY',
    hints: ['The first defender to win UEFA Men\'s Player of the Year.', 'Runner-up for the 2019 Ballon d\'Or.', 'Joined Liverpool for a then-record fee for a defender.', 'Captains the Netherlands.']
  },
  {
    name: 'Alisson Becker', nationality: 'Brazil', position: 'Goalkeeper', club: 'Liverpool', league: 'Premier League', birthYear: 1992, jerseyNumber: 1, difficulty: 'EASY',
    hints: ['Scored a last-minute header goal vs West Brom.', 'Won the inaugural Yashin Trophy in 2019.', 'Known for his incredible 1v1 shot-stopping.', 'Signed from AS Roma.']
  },
  {
    name: 'Bernardo Silva', nationality: 'Portugal', position: 'Midfielder', club: 'Manchester City', league: 'Premier League', birthYear: 1994, jerseyNumber: 20, difficulty: 'EASY',
    hints: ['The "engine room" of Pep Guardiola\'s midfield.', 'Won the 2019 Nations League Player of the Tournament.', 'Known for his tireless pressing and ball retention.', 'Started at Benfica.']
  },
  {
    name: 'Antoine Griezmann', nationality: 'France', position: 'Forward', club: 'Atletico Madrid', league: 'La Liga', birthYear: 1991, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['Man of the Match in the 2018 World Cup Final.', 'Atletico Madrid\'s all-time leading goalscorer.', 'Known for his creative "Hotline Bling" celebration.', 'Played for Real Sociedad.']
  },
  {
    name: 'Phil Foden', nationality: 'England', position: 'Midfielder', club: 'Manchester City', league: 'Premier League', birthYear: 2000, jerseyNumber: 47, difficulty: 'EASY',
    hints: ['The "Stockport Iniesta".', 'Won the PL Player of the Season in 2024.', 'Has worn the number 47 throughout his City career.', 'Won the U-17 World Cup Golden Ball.']
  },
  {
    name: 'Rodrigo Hernandez', nationality: 'Spain', position: 'Midfielder', club: 'Manchester City', league: 'Premier League', birthYear: 1996, jerseyNumber: 16, difficulty: 'EASY',
    hints: ['Scored the winning goal in the 2023 UCL Final.', 'Often tucked his shirt in during matches.', 'The successor to Sergio Busquets in the Spain squad.', 'Played for Villarreal and Atletico.']
  },
  {
    name: 'Bruno Fernandes', nationality: 'Portugal', position: 'Midfielder', club: 'Manchester United', league: 'Premier League', birthYear: 1994, jerseyNumber: 8, difficulty: 'EASY',
    hints: ['Captain of Manchester United.', 'Known for his "jump" penalty technique.', 'Was a goal-scoring machine at Sporting CP.', 'Signed for United in January 2020.']
  },
  {
    name: 'Martin Odegaard', nationality: 'Norway', position: 'Midfielder', club: 'Arsenal', league: 'Premier League', birthYear: 1998, jerseyNumber: 8, difficulty: 'EASY',
    hints: ['Signed by Real Madrid at just 16 years old.', 'Current captain of Arsenal.', 'Had loan spells at Heerenveen, Vitesse, and Real Sociedad.', 'Norway\'s national team captain.']
  },
  {
    name: 'Declan Rice', nationality: 'England', position: 'Midfielder', club: 'Arsenal', league: 'Premier League', birthYear: 1999, jerseyNumber: 41, difficulty: 'EASY',
    hints: ['Joined Arsenal for 100m+ in 2023.', 'Captain of West Ham when they won the Conference League.', 'Released by Chelsea as a youth player.', 'Wears number 41.']
  },
  {
    name: 'Marcus Rashford', nationality: 'England', position: 'Forward', club: 'Manchester United', league: 'Premier League', birthYear: 1997, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Scored on his PL, Europa League, and England debuts.', 'Known for his charity work and free school meals campaign.', 'Awarded an MBE.', 'A Manchester United academy graduate.']
  },
  {
    name: 'Luis Diaz', nationality: 'Colombia', position: 'Forward', club: 'Liverpool', league: 'Premier League', birthYear: 1997, jerseyNumber: 7, difficulty: 'EASY',
    hints: ['Known for his electric pace and flair on the left wing.', 'Signed from FC Porto.', 'Joint top-scorer at Copa America 2021.', 'Often plays with high-intensity pressing.']
  },
  {
    name: 'Cole Palmer', nationality: 'England', position: 'Midfielder', club: 'Chelsea', league: 'Premier League', birthYear: 2002, jerseyNumber: 20, difficulty: 'EASY',
    hints: ['Nickname is "Cold" Palmer.', 'Transferred from Man City to Chelsea in 2023.', 'Famous for his shivering celebration.', 'Scored 20+ goals in his first Chelsea season.']
  },
  {
    name: 'Julian Alvarez', nationality: 'Argentina', position: 'Forward', club: 'Atletico Madrid', league: 'La Liga', birthYear: 2000, jerseyNumber: 19, difficulty: 'EASY',
    hints: ['Nickname is "El Arana" (The Spider).', 'Won the World Cup and Champions League in the same season (2023).', 'Joined Atletico from Man City in 2024.', 'Won everything at River Plate.']
  },
  {
    name: 'Enzo Fernandez', nationality: 'Argentina', position: 'Midfielder', club: 'Chelsea', league: 'Premier League', birthYear: 2001, jerseyNumber: 8, difficulty: 'EASY',
    hints: ['Won Best Young Player at the 2022 World Cup.', 'Chelsea\'s record signing from Benfica.', 'Started at River Plate.', 'Key part of Argentina\'s midfield engine.']
  },
  {
    name: 'Rafael Leao', nationality: 'Portugal', position: 'Forward', club: 'AC Milan', league: 'Serie A', birthYear: 1999, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Scored the fastest goal in Serie A history (6.2 seconds).', 'Known for smiling while dribbling past defenders.', 'Won the Serie A MVP in 2022.', 'Signed from Lille.']
  },
  {
    name: 'Lautaro Martinez', nationality: 'Argentina', position: 'Striker', club: 'Inter Milan', league: 'Serie A', birthYear: 1997, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Nickname is "El Toro".', 'Captain of Inter Milan.', 'Scored the winning goal in the 2024 Copa America Final.', 'Signed from Racing Club.']
  },
  {
    name: 'Federico Valverde', nationality: 'Uruguay', position: 'Midfielder', club: 'Real Madrid', league: 'La Liga', birthYear: 1998, jerseyNumber: 8, difficulty: 'EASY',
    hints: ['Inherited Toni Kroos\' number 8 jersey.', 'Famous for his "tactical foul" on Morata in a Supercopa.', 'Known as "El Halcon" (The Falcon).', 'Incredible long-range shooting.']
  },
  {
    name: 'Darwin Nunez', nationality: 'Uruguay', position: 'Striker', club: 'Liverpool', league: 'Premier League', birthYear: 1999, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['The "Agent of Chaos".', 'Liverpool\'s expensive signing from Benfica.', 'Known for his incredible speed and physique.', 'Inherited the number 9 from Firmino.']
  },
  {
    name: 'Thibaut Courtois', nationality: 'Belgium', position: 'Goalkeeper', club: 'Real Madrid', league: 'La Liga', birthYear: 1992, jerseyNumber: 1, difficulty: 'EASY',
    hints: ['Man of the Match in the 2022 Champions League Final.', 'Played for both Atletico and Real Madrid.', 'Won the Golden Glove at the 2018 World Cup.', 'Extremely tall at 6ft 7in.']
  },
  {
    name: 'Jan Oblak', nationality: 'Slovenia', position: 'Goalkeeper', club: 'Atletico Madrid', league: 'La Liga', birthYear: 1993, jerseyNumber: 13, difficulty: 'EASY',
    hints: ['Widely considered the best shot-stopper in La Liga history.', 'Won 5 Zamora Trophies.', 'Slovenia\'s national team captain.', 'Key part of Simeone\'s defense for a decade.']
  },
  {
    name: 'Dusan Vlahovic', nationality: 'Serbia', position: 'Striker', club: 'Juventus', league: 'Serie A', birthYear: 2000, jerseyNumber: 9, difficulty: 'EASY',
    hints: ['Joined Juventus for a huge fee from Fiorentina.', 'A left-footed powerhouse striker.', 'Equalled Cristiano Ronaldo\'s record for Serie A goals in a calendar year.', 'Serbia\'s main man.']
  },
  {
    name: 'Khvicha Kvaratskhelia', nationality: 'Georgia', position: 'Forward', club: 'Napoli', league: 'Serie A', birthYear: 2001, jerseyNumber: 77, difficulty: 'EASY',
    hints: ['Nicknamed "Kvaradona" by Napoli fans.', 'Led Napoli to their first Scudetto in 33 years.', 'Plays with his socks down low.', 'The superstar of Georgian football.']
  },
  {
    name: 'Victor Osimhen', nationality: 'Nigeria', position: 'Striker', club: 'Galatasaray', league: 'Super Lig', birthYear: 1998, jerseyNumber: 45, difficulty: 'EASY',
    hints: ['Serie A Top Scorer in Napoli\'s title-winning season.', 'Wears a protective black mask during games.', 'Joined Galatasaray on a shock loan in 2024.', 'African Footballer of the Year 2023.']
  },
  {
    name: 'Alphonso Davies', nationality: 'Canada', position: 'Defender', club: 'Bayern Munich', league: 'Bundesliga', birthYear: 2000, jerseyNumber: 19, difficulty: 'EASY',
    hints: ['Nicknamed "The Roadrunner" for his speed.', 'Born in a refugee camp in Ghana.', 'First Canadian to win the Champions League.', 'Plays as a winger for Canada.']
  },
  {
    name: 'Jamal Musiala', nationality: 'Germany', position: 'Midfielder', club: 'Bayern Munich', league: 'Bundesliga', birthYear: 2003, jerseyNumber: 42, difficulty: 'EASY',
    hints: ['Nicknamed "Bambi" for his slender frame and agility.', 'Represented England at youth level before choosing Germany.', 'The jewel of Bayern\'s midfield.', 'Wears number 42.']
  },
  {
    name: 'Florian Wirtz', nationality: 'Germany', position: 'Midfielder', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 2003, jerseyNumber: 10, difficulty: 'EASY',
    hints: ['Key star in Leverkusen\'s unbeaten Bundesliga title run.', 'The youngest player to reach 50 Bundesliga assists.', 'Suffered an ACL injury but returned better than ever.', 'Wears number 10.']
  },

  // ─── MEDIUM (40 PLAYERS) ─────────────────────────────────
  {
    name: 'Alexander Isak', nationality: 'Sweden', position: 'Striker', club: 'Newcastle', league: 'Premier League', birthYear: 1999, jerseyNumber: 14, difficulty: 'MEDIUM',
    hints: ['Compared frequently to Thierry Henry.', 'Newcastle\'s record signing from Real Sociedad.', 'Often praised for his "ice-cold" finishing.', 'Sweden\'s star striker.']
  },
  {
    name: 'Ousmane Dembele', nationality: 'France', position: 'Forward', club: 'PSG', league: 'Ligue 1', birthYear: 1997, jerseyNumber: 10, difficulty: 'MEDIUM',
    hints: ['Equally good with both feet (ambipedal).', 'Former Barcelona and Dortmund winger.', 'Joined PSG in 2023.', 'Known for his explosive pace and skills.']
  },
  {
    name: 'Kingsley Coman', nationality: 'France', position: 'Forward', club: 'Bayern Munich', league: 'Bundesliga', birthYear: 1996, jerseyNumber: 11, difficulty: 'MEDIUM',
    hints: ['Scored the winning goal in the 2020 UCL Final.', 'Won the league title in every season of his pro career until 2024.', 'Played for PSG, Juventus, and Bayern.', 'The "King" of wingers.']
  },
  {
    name: 'Alexis Mac Allister', nationality: 'Argentina', position: 'Midfielder', club: 'Liverpool', league: 'Premier League', birthYear: 1998, jerseyNumber: 10, difficulty: 'MEDIUM',
    hints: ['Of Irish/Scottish descent but plays for Argentina.', 'Won the World Cup while playing for Brighton.', 'Joined Liverpool for a bargain fee in 2023.', 'Wears the number 10 at Anfield.']
  },
  {
    name: 'Dominik Szoboszlai', nationality: 'Hungary', position: 'Midfielder', club: 'Liverpool', league: 'Premier League', birthYear: 2000, jerseyNumber: 8, difficulty: 'MEDIUM',
    hints: ['Known for his elite set-piece delivery and long shots.', 'Captain of the Hungarian national team.', 'Joined Liverpool from RB Leipzig.', 'Has a tattoo of a Steven Gerrard quote.']
  },
  {
    name: 'William Saliba', nationality: 'France', position: 'Defender', club: 'Arsenal', league: 'Premier League', birthYear: 2001, jerseyNumber: 2, difficulty: 'MEDIUM',
    hints: ['Had three loan spells in France before his Arsenal breakthrough.', 'Often described as "Rolls Royce" of defenders.', 'Key in Arsenal\'s defensive transformation.', 'Signed from Saint-Etienne.']
  },
  {
    name: 'Gabriel Magalhaes', nationality: 'Brazil', position: 'Defender', club: 'Arsenal', league: 'Premier League', birthYear: 1997, jerseyNumber: 6, difficulty: 'MEDIUM',
    hints: ['Arsenal\'s highest-scoring defender in recent years.', 'Formed a "wall" with William Saliba.', 'Left-footed center-back.', 'Signed from Lille.']
  },
  {
    name: 'Theo Hernandez', nationality: 'France', position: 'Defender', club: 'AC Milan', league: 'Serie A', birthYear: 1997, jerseyNumber: 19, difficulty: 'MEDIUM',
    hints: ['Arguably the most attacking left-back in the world.', 'Scored a solo goal after running the length of the pitch vs Atalanta.', 'His brother plays for Bayern Munich.', 'Signed from Real Madrid.']
  },
  {
    name: 'Achraf Hakimi', nationality: 'Morocco', position: 'Defender', club: 'PSG', league: 'Ligue 1', birthYear: 1998, jerseyNumber: 2, difficulty: 'MEDIUM',
    hints: ['Born in Madrid, but stars for Morocco.', 'Scored a "Panenka" penalty to knock Spain out of the World Cup.', 'Best friends with Kylian Mbappe.', 'Played for Real, Dortmund, Inter, and PSG.']
  },
  {
    name: 'Nico Williams', nationality: 'Spain', position: 'Forward', club: 'Athletic Bilbao', league: 'La Liga', birthYear: 2002, jerseyNumber: 11, difficulty: 'MEDIUM',
    hints: ['Euro 2024 breakout star.', 'Plays alongside his older brother at club level.', 'Known for his insane speed on the wing.', 'Rejected big clubs to stay at Bilbao.']
  },
  {
    name: 'Lamine Yamal', nationality: 'Spain', position: 'Forward', club: 'Barcelona', league: 'La Liga', birthYear: 2007, jerseyNumber: 19, difficulty: 'MEDIUM',
    hints: ['Youngest player to ever play/score in a Euro tournament.', 'Broke almost every "youngest ever" record for Barcelona.', 'Wears 19, like early Messi.', 'Has "304" in his celebration (neighborhood code).']
  },
  {
    name: 'Xavi Simons', nationality: 'Netherlands', position: 'Midfielder', club: 'RB Leipzig', league: 'Bundesliga', birthYear: 2003, jerseyNumber: 20, difficulty: 'MEDIUM',
    hints: ['Was a social media sensation at Barcelona\'s academy.', 'Joined PSG, then excelled at PSV and Leipzig.', 'Named after a Barcelona legend.', 'Known for his creative flair.']
  },
  {
    name: 'Gavi', nationality: 'Spain', position: 'Midfielder', club: 'Barcelona', league: 'La Liga', birthYear: 2004, jerseyNumber: 6, difficulty: 'MEDIUM',
    hints: ['Known for playing with his shoelaces untied.', 'Aggressive, high-energy midfield style.', 'Inherited Xavi\'s number 6 jersey.', 'Youngest player to play for Spain (at the time).']
  },
  {
    name: 'Pedri', nationality: 'Spain', position: 'Midfielder', club: 'Barcelona', league: 'La Liga', birthYear: 2002, jerseyNumber: 8, difficulty: 'MEDIUM',
    hints: ['Compared to Andres Iniesta.', 'Played over 70 games in his debut pro season.', 'Won the Golden Boy award in 2021.', 'Signed from Las Palmas.']
  },
  {
    name: 'Josko Gvardiol', nationality: 'Croatia', position: 'Defender', club: 'Manchester City', league: 'Premier League', birthYear: 2002, jerseyNumber: 24, difficulty: 'MEDIUM',
    hints: ['The most expensive defender in history (at the time).', 'Famous for wearing a mask at the 2022 World Cup.', 'Scored some stunning long-range goals from LB.', 'Signed from RB Leipzig.']
  },
  {
    name: 'Christopher Nkunku', nationality: 'France', position: 'Forward', club: 'Chelsea', league: 'Premier League', birthYear: 1997, jerseyNumber: 18, difficulty: 'MEDIUM',
    hints: ['Known for his "balloon" goal celebration.', 'Bundesliga Player of the Season in 2022.', 'Extremely versatile attacker.', 'Signed from RB Leipzig.']
  },
  {
    name: 'Dani Olmo', nationality: 'Spain', position: 'Midfielder', club: 'Barcelona', league: 'La Liga', birthYear: 1998, jerseyNumber: 20, difficulty: 'MEDIUM',
    hints: ['Left Barcelona\'s academy to play in Croatia (Dinamo Zagreb).', 'A star for Spain at Euro 2024.', 'Returned to Barcelona in 2024.', 'Known for his high football IQ.']
  },
  {
    name: 'Hakan Calhanoglu', nationality: 'Turkey', position: 'Midfielder', club: 'Inter Milan', league: 'Serie A', birthYear: 1994, jerseyNumber: 20, difficulty: 'MEDIUM',
    hints: ['The "Free-kick King" of his generation.', 'Transferred directly from AC Milan to Inter Milan.', 'Transformed into a world-class deep-lying playmaker.', 'Turkey\'s captain.']
  },
  {
    name: 'Alessandro Bastoni', nationality: 'Italy', position: 'Defender', club: 'Inter Milan', league: 'Serie A', birthYear: 1999, jerseyNumber: 95, difficulty: 'MEDIUM',
    hints: ['Considered the best ball-playing CB in Italy.', 'Known for his pinpoint long-range assists.', 'Has worn the number 95 throughout his career.', 'Won the Scudetto twice.']
  },
  {
    name: 'Emi Martinez', nationality: 'Argentina', position: 'Goalkeeper', club: 'Aston Villa', league: 'Premier League', birthYear: 1992, jerseyNumber: 23, difficulty: 'MEDIUM',
    hints: ['Nickname is "Dibu".', 'Famous for his penalty shootout mind games.', 'Won the Golden Glove at the 2022 World Cup.', 'Spent 10 years at Arsenal mostly on loan.']
  },
  {
    name: 'Ollie Watkins', nationality: 'England', position: 'Striker', club: 'Aston Villa', league: 'Premier League', birthYear: 1995, jerseyNumber: 11, difficulty: 'MEDIUM',
    hints: ['Scored the last-minute winner in the Euro 2024 Semi-final.', 'A former Brentford and Exeter City striker.', 'Reached 20+ PL goals in a single season.', 'The focal point of Unai Emery\'s Villa.']
  },
  {
    name: 'Douglas Luiz', nationality: 'Brazil', position: 'Midfielder', club: 'Juventus', league: 'Serie A', birthYear: 1998, jerseyNumber: 26, difficulty: 'MEDIUM',
    hints: ['Joined Juventus from Aston Villa in 2024.', 'Known for scoring goals directly from corner kicks.', 'Was once a Man City player but never played for them.', 'A master of the pivot role.']
  },
  {
    name: 'James Maddison', nationality: 'England', position: 'Midfielder', club: 'Tottenham', league: 'Premier League', birthYear: 1996, jerseyNumber: 10, difficulty: 'MEDIUM',
    hints: ['Known for his creative flair and elite set-pieces.', 'Joined Spurs after Leicester City\'s relegation.', 'Wears the number 10 at Tottenham.', 'Famous for his honest post-match interviews.']
  },
  {
    name: 'Micky van de Ven', nationality: 'Netherlands', position: 'Defender', club: 'Tottenham', league: 'Premier League', birthYear: 2001, jerseyNumber: 37, difficulty: 'MEDIUM',
    hints: ['Recorded the fastest sprint speed in PL history.', 'Left-footed center-back.', 'Joined Spurs from Wolfsburg.', 'Known for his recovery tackles.']
  },
  {
    name: 'Anthony Gordon', nationality: 'England', position: 'Forward', club: 'Newcastle', league: 'Premier League', birthYear: 2001, jerseyNumber: 10, difficulty: 'MEDIUM',
    hints: ['Everton academy graduate who joined Newcastle.', 'Won U-21 Euro Player of the Tournament.', 'Known for his direct running and high work rate.', 'Inherited the number 10 at Newcastle.']
  },
  {
    name: 'Bruno Guimaraes', nationality: 'Brazil', position: 'Midfielder', club: 'Newcastle', league: 'Premier League', birthYear: 1997, jerseyNumber: 39, difficulty: 'MEDIUM',
    hints: ['The heartbeat of Newcastle\'s midfield.', 'Wears number 39 in honor of his father\'s taxi number.', 'Signed from Lyon.', 'A Brazilian international.']
  },
  {
    name: 'Viktor Gyokeres', nationality: 'Sweden', position: 'Striker', club: 'Sporting CP', league: 'Liga Portugal', birthYear: 1998, jerseyNumber: 9, difficulty: 'MEDIUM',
    hints: ['The most prolific striker in Europe in 2023/24.', 'Famous for his "interlocked fingers" celebration.', 'Signed from Coventry City.', 'Swedish international.']
  },
  {
    name: 'Lois Openda', nationality: 'Belgium', position: 'Forward', club: 'RB Leipzig', league: 'Bundesliga', birthYear: 2000, jerseyNumber: 17, difficulty: 'MEDIUM',
    hints: ['Exploded onto the scene with RC Lens before moving to Germany.', 'Extremely fast and clinical in transitions.', 'A key part of the post-Hazard Belgium era.', 'Has Congolese roots.']
  },
  {
    name: 'Jeremie Frimpong', nationality: 'Netherlands', position: 'Defender', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 2001, jerseyNumber: 30, difficulty: 'MEDIUM',
    hints: ['Plays more like a winger than a right-back.', 'Key part of Xabi Alonso\'s invincible season.', 'Product of Man City and Celtic academies.', 'Famous for his post-match "Oh my days!" interview.']
  },
  {
    name: 'Alejandro Grimaldo', nationality: 'Spain', position: 'Defender', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 1995, jerseyNumber: 20, difficulty: 'MEDIUM',
    hints: ['Free-kick specialist from left-back.', 'Spent many years at Benfica before joining Leverkusen.', 'Product of Barcelona\'s La Masia.', 'Record-breaking season for goal involvements by a defender.']
  },
  {
    name: 'Granit Xhaka', nationality: 'Switzerland', position: 'Midfielder', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 1992, jerseyNumber: 34, difficulty: 'MEDIUM',
    hints: ['Former Arsenal captain who revitalized his career.', 'Led Leverkusen to an invincible domestic double.', 'Known for his leadership and long-range shooting.', 'Switzerland\'s all-time record cap holder.']
  },
  {
    name: 'Serhou Guirassy', nationality: 'Guinea', position: 'Striker', club: 'Borussia Dortmund', league: 'Bundesliga', birthYear: 1996, jerseyNumber: 9, difficulty: 'MEDIUM',
    hints: ['Scored 28 goals in 28 games for Stuttgart in 2023/24.', 'Joined Dortmund in 2024.', 'Clinical finisher with both feet.', 'Represents Guinea internationally.']
  },
  {
    name: 'Lucas Paqueta', nationality: 'Brazil', position: 'Midfielder', club: 'West Ham', league: 'Premier League', birthYear: 1997, jerseyNumber: 10, difficulty: 'MEDIUM',
    hints: ['West Ham\'s creative Brazilian magician.', 'Known for his flair, dancing celebrations, and eye for a pass.', 'Played for Flamengo, AC Milan, and Lyon.', 'Key player for the Brazil NT.']
  },
  {
    name: 'Mohammed Kudus', nationality: 'Ghana', position: 'Midfielder', club: 'West Ham', league: 'Premier League', birthYear: 2000, jerseyNumber: 14, difficulty: 'MEDIUM',
    hints: ['Famous for his "sitting on the advertising hoardings" celebration.', 'Signed from Ajax.', 'Ghana\'s biggest footballing star.', 'Known for his incredible balance and dribbling.']
  },
  {
    name: 'Darwin Machis', nationality: 'Venezuela', position: 'Forward', club: 'Valladolid', league: 'La Liga', birthYear: 1993, jerseyNumber: 11, difficulty: 'MEDIUM',
    hints: ['A speedy winger with a rocket of a right foot.', 'Veteran of many La Liga clubs including Granada.', 'A key figure in Venezuela\'s "Vinotinto" squad.', 'Has played in Spain, Italy, and Portugal.']
  },
  {
    name: 'Takefusa Kubo', nationality: 'Japan', position: 'Forward', club: 'Real Sociedad', league: 'La Liga', birthYear: 2001, jerseyNumber: 14, difficulty: 'MEDIUM',
    hints: ['The "Japanese Messi".', 'Spent time in both Barcelona and Real Madrid academies.', 'Became a superstar at Real Sociedad.', 'Japan\'s creative spark.']
  },
  {
    name: 'Kaoru Mitoma', nationality: 'Japan', position: 'Forward', club: 'Brighton', league: 'Premier League', birthYear: 1997, jerseyNumber: 22, difficulty: 'MEDIUM',
    hints: ['Wrote a university thesis on the art of dribbling.', 'Joined Brighton for a small fee from Japan.', 'Famous for his elite ball-carrying and 1v1 ability.', 'Spent a season on loan at Union SG.']
  },
  {
    name: 'Pervis Estupinan', nationality: 'Ecuador', position: 'Defender', club: 'Brighton', league: 'Premier League', birthYear: 1998, jerseyNumber: 30, difficulty: 'MEDIUM',
    hints: ['High-flying Ecuadorian left-back.', 'Joined Brighton from Villarreal.', 'Key part of Brighton\'s Europa League qualification.', 'Known for his crossing and stamina.']
  },
  {
    name: 'Moises Caicedo', nationality: 'Ecuador', position: 'Midfielder', club: 'Chelsea', league: 'Premier League', birthYear: 2001, jerseyNumber: 25, difficulty: 'MEDIUM',
    hints: ['The subject of a record-breaking transfer battle between Chelsea and Liverpool.', 'Chelsea\'s most expensive signing ever.', 'Started his career at Independiente del Valle.', 'Wears number 25.']
  },
  {
    name: 'Nicolas Jackson', nationality: 'Senegal', position: 'Striker', club: 'Chelsea', league: 'Premier League', birthYear: 2001, jerseyNumber: 15, difficulty: 'MEDIUM',
    hints: ['Signed from Villarreal after a hot scoring streak.', 'Known for his pace and link-up play.', 'Scored a hat-trick against Tottenham in 2023.', 'Represents Senegal.']
  },

  // ─── HARD (35 PLAYERS) ────────────────────────────────────
  {
    name: 'Artem Dovbyk', nationality: 'Ukraine', position: 'Striker', club: 'AS Roma', league: 'Serie A', birthYear: 1997, jerseyNumber: 11, difficulty: 'HARD',
    hints: ['La Liga Top Scorer (Pichichi) in 2023/24 with Girona.', 'Joined AS Roma in 2024.', 'Scored the winning goal for Ukraine in the Euro 2020 Round of 16.', 'Physical, old-school striker.']
  },
  {
    name: 'Savinho', nationality: 'Brazil', position: 'Forward', club: 'Manchester City', league: 'Premier League', birthYear: 2004, jerseyNumber: 26, difficulty: 'HARD',
    hints: ['Breakout star for Girona before joining Man City.', 'Known for his direct dribbling and flair.', 'Previously played for Troyes and PSV.', 'A Brazil international at 20.']
  },
  {
    name: 'Pau Cubarsi', nationality: 'Spain', position: 'Defender', club: 'Barcelona', league: 'La Liga', birthYear: 2007, jerseyNumber: 2, difficulty: 'HARD',
    hints: ['Youngest defender to start a UCL knockout match for Barca.', 'Praised for his unbelievable passing range at age 17.', 'Product of La Masia.', 'Euro 2024 winner with Spain.']
  },
  {
    name: 'Kobbie Mainoo', nationality: 'England', position: 'Midfielder', club: 'Manchester United', league: 'Premier League', birthYear: 2005, jerseyNumber: 37, difficulty: 'HARD',
    hints: ['Scored the winner in the 2024 FA Cup Final.', 'United\'s academy breakout star of 2024.', 'Known for his calmness under pressure.', 'Started for England at Euro 2024 as a teen.']
  },
  {
    name: 'Alejandro Garnacho', nationality: 'Argentina', position: 'Forward', club: 'Manchester United', league: 'Premier League', birthYear: 2004, jerseyNumber: 17, difficulty: 'HARD',
    hints: ['Scored a famous overhead kick goal vs Everton.', 'Born in Spain but plays for Argentina.', 'An idolizer of Cristiano Ronaldo.', 'Winner of the 2022 Jimmy Murphy Young Player of the Year.']
  },
  {
    name: 'Warren Zaire-Emery', nationality: 'France', position: 'Midfielder', club: 'PSG', league: 'Ligue 1', birthYear: 2006, jerseyNumber: 33, difficulty: 'HARD',
    hints: ['Youngest ever goalscorer for PSG.', 'Became a starter for PSG and France at just 17.', 'Known for his maturity and physical strength.', 'Product of the PSG academy.']
  },
  {
    name: 'Bradley Barcola', nationality: 'France', position: 'Forward', club: 'PSG', league: 'Ligue 1', birthYear: 2002, jerseyNumber: 29, difficulty: 'HARD',
    hints: ['Joined PSG from Lyon for a huge fee.', 'Known for his lanky frame and elite dribbling.', 'Took over the left-wing spot after Mbappe\'s departure.', 'Euro 2024 French international.']
  },
  {
    name: 'Vitor Roque', nationality: 'Brazil', position: 'Striker', club: 'Real Betis', league: 'La Liga', birthYear: 2005, jerseyNumber: 8, difficulty: 'HARD',
    hints: ['Nicknamed "Tigrinho" (Little Tiger).', 'Joined Barcelona from Athletico Paranaense but struggled for minutes.', 'Loaned to Real Betis in 2024.', 'A high-potential Brazilian striker.']
  },
  {
    name: 'Kenan Yildiz', nationality: 'Turkey', position: 'Forward', club: 'Juventus', league: 'Serie A', birthYear: 2005, jerseyNumber: 10, difficulty: 'HARD',
    hints: ['Inherited the number 10 at Juventus at age 19.', 'Known for his "tongue-out" celebration (Del Piero style).', 'Born in Germany, but plays for Turkey.', 'Signed from Bayern Munich\'s academy.']
  },
  {
    name: 'Teun Koopmeiners', nationality: 'Netherlands', position: 'Midfielder', club: 'Juventus', league: 'Serie A', birthYear: 1998, jerseyNumber: 8, difficulty: 'HARD',
    hints: ['The highest scoring midfielder in Serie A in 2023/24.', 'Joined Juventus from Atalanta in 2024.', 'Known for his elite penalty taking and long shots.', 'Former AZ Alkmaar captain.']
  },
  {
    name: 'Ederson Moraes', nationality: 'Brazil', position: 'Goalkeeper', club: 'Manchester City', league: 'Premier League', birthYear: 1993, jerseyNumber: 31, difficulty: 'HARD',
    hints: ['Has a "smiley face" tattoo behind his ear.', 'Famous for his unbelievable long-range passing.', 'Known for playing very high up the pitch.', 'Joined City from Benfica.']
  },
  {
    name: 'Gelson Martins', nationality: 'Portugal', position: 'Forward', club: 'Olympiacos', league: 'Greek Super League', birthYear: 1995, jerseyNumber: 10, difficulty: 'HARD',
    hints: ['A former star at Sporting CP and Atletico Madrid.', 'Spent several years at AS Monaco.', 'Known for his extreme agility and speed.', 'Portuguese international.']
  },
  {
    name: 'Inaki Williams', nationality: 'Ghana', position: 'Forward', club: 'Athletic Bilbao', league: 'La Liga', birthYear: 1994, jerseyNumber: 9, difficulty: 'HARD',
    hints: ['Held the record for playing 251 consecutive La Liga games without missing one.', 'Born in Spain, plays for Ghana.', 'His brother plays for Spain.', 'Bilbao legend.']
  },
  {
    name: 'Jonathan David', nationality: 'Canada', position: 'Striker', club: 'Lille', league: 'Ligue 1', birthYear: 2000, jerseyNumber: 9, difficulty: 'HARD',
    hints: ['The "Ice Man" of Canadian football.', 'Won Ligue 1 with Lille in 2021.', 'Consistent 20-goal-a-season striker in France.', 'Born in Brooklyn, USA.']
  },
  {
    name: 'Santiago Gimenez', nationality: 'Mexico', position: 'Striker', club: 'Feyenoord', league: 'Eredivisie', birthYear: 2001, jerseyNumber: 29, difficulty: 'HARD',
    hints: ['Nickname is "Bebote".', 'Broke Luis Suarez\'s record for most Eredivisie goals in a calendar year.', 'Key star for the Mexico national team.', 'Born in Argentina.']
  },
  {
    name: 'Johan Bakayoko', nationality: 'Belgium', position: 'Forward', club: 'PSV', league: 'Eredivisie', birthYear: 2003, jerseyNumber: 11, difficulty: 'HARD',
    hints: ['Electric winger for PSV Eindhoven.', 'Rejected major PL moves to stay and develop in Holland.', 'The future of Belgium\'s wings.', 'High-volume dribbler.']
  },
  {
    name: 'Oihan Sancet', nationality: 'Spain', position: 'Midfielder', club: 'Athletic Bilbao', league: 'La Liga', birthYear: 2000, jerseyNumber: 8, difficulty: 'HARD',
    hints: ['The tall, elegant playmaker of Bilbao.', 'Scored a hat-trick for Athletic Club in 2023.', 'Regular for the Spanish U-21s and now senior squad.', 'Signed from Osasuna\'s academy.']
  },
  {
    name: 'Goncalo Ramos', nationality: 'Portugal', position: 'Striker', club: 'PSG', league: 'Ligue 1', birthYear: 2001, jerseyNumber: 9, difficulty: 'HARD',
    hints: ['Scored a hat-trick in his first World Cup start (replacing Ronaldo).', 'Joined PSG from Benfica.', 'Known for his "pistols" goal celebration.', 'Classic poacher.']
  },
  {
    name: 'Malo Gusto', nationality: 'France', position: 'Defender', club: 'Chelsea', league: 'Premier League', birthYear: 2003, jerseyNumber: 27, difficulty: 'HARD',
    hints: ['The Frenchman who stepped up for Reece James.', 'Joined Chelsea from Lyon.', 'Known for his excellent crossing and recovery speed.', 'One of the best young RB in the world.']
  },
  {
    name: 'Conor Gallagher', nationality: 'England', position: 'Midfielder', club: 'Atletico Madrid', league: 'La Liga', birthYear: 2000, jerseyNumber: 4, difficulty: 'HARD',
    hints: ['Joined Atletico from Chelsea in 2024.', 'Famous for his incredible stamina and pressing.', 'Had a successful loan at Crystal Palace.', 'A "workhorse" midfielder.']
  },
  {
    name: 'Vitaliy Mykolenko', nationality: 'Ukraine', position: 'Defender', club: 'Everton', league: 'Premier League', birthYear: 1999, jerseyNumber: 19, difficulty: 'HARD',
    hints: ['Reliable left-back for Everton.', 'Joined from Dynamo Kyiv.', 'A key part of Ukraine\'s defensive line.', 'Known for his tackling and strength.']
  },
  {
    name: 'Murillo', nationality: 'Brazil', position: 'Defender', club: 'Nottingham Forest', league: 'Premier League', birthYear: 2002, jerseyNumber: 40, difficulty: 'HARD',
    hints: ['Breakout Brazilian CB of the 2023/24 PL season.', 'Known for his incredible ball-carrying and long passes.', 'Signed from Corinthians for a bargain.', 'Left-footed.']
  },
  {
    name: 'Joao Neves', nationality: 'Portugal', position: 'Midfielder', club: 'PSG', league: 'Ligue 1', birthYear: 2004, jerseyNumber: 87, difficulty: 'HARD',
    hints: ['The latest 70m+ export from Benfica\'s academy.', 'Small in stature but dominates the midfield.', 'Joined PSG in 2024.', 'Plays with his shirt tucked in.']
  },
  {
    name: 'Exequiel Palacios', nationality: 'Argentina', position: 'Midfielder', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 1998, jerseyNumber: 25, difficulty: 'HARD',
    hints: ['Silent hero of Leverkusen\'s invincible season.', 'World Cup winner with Argentina in 2022.', 'Joined from River Plate.', 'A complete box-to-box midfielder.']
  },
  {
    name: 'Edmond Tapsoba', nationality: 'Burkina Faso', position: 'Defender', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 1999, jerseyNumber: 12, difficulty: 'HARD',
    hints: ['Arguably the best African center-back currently.', 'The defensive rock of Burkina Faso.', 'Known for his composure and pace.', 'Joined from Vitoria Guimaraes.']
  },
  {
    name: 'Piero Hincapie', nationality: 'Ecuador', position: 'Defender', club: 'Bayer Leverkusen', league: 'Bundesliga', birthYear: 2002, jerseyNumber: 3, difficulty: 'HARD',
    hints: ['A versatile left-footed defender (CB or LB).', 'Star for the Ecuador national team.', 'One of the fastest defenders in the Bundesliga.', 'Signed from Talleres.']
  },
  {
    name: 'Lewis Hall', nationality: 'England', position: 'Defender', club: 'Newcastle', league: 'Premier League', birthYear: 2004, jerseyNumber: 20, difficulty: 'HARD',
    hints: ['Chelsea academy graduate who joined Newcastle.', 'A midfielder-turned-left-back.', 'Known for his technical ability and delivery.', 'English youth international.']
  },
  {
    name: 'Rico Lewis', nationality: 'England', position: 'Defender', club: 'Manchester City', league: 'Premier League', birthYear: 2004, jerseyNumber: 82, difficulty: 'HARD',
    hints: ['The "inverted full-back" specialist under Pep.', 'City academy graduate.', 'Can play RB, LB, and DM equally well.', 'Youngest City player to score in the UCL.']
  },
  {
    name: 'Tino Livramento', nationality: 'England', position: 'Defender', club: 'Newcastle', league: 'Premier League', birthYear: 2002, jerseyNumber: 21, difficulty: 'HARD',
    hints: ['Joined Newcastle after an injury-hit spell at Southampton.', 'Product of Chelsea\'s academy.', 'Known for his incredible pace and 1v1 defending.', 'Highly rated young RB.']
  },
  {
    name: 'Adam Wharton', nationality: 'England', position: 'Midfielder', club: 'Crystal Palace', league: 'Premier League', birthYear: 2004, jerseyNumber: 20, difficulty: 'HARD',
    hints: ['Joined Palace from Blackburn Rovers in Jan 2024.', 'Immediately called up to England\'s Euro 2024 squad.', 'Known for his elite forward passing.', 'A pure "No. 6".']
  },
  {
    name: 'Eberechi Eze', nationality: 'England', position: 'Midfielder', club: 'Crystal Palace', league: 'Premier League', birthYear: 1998, jerseyNumber: 10, difficulty: 'HARD',
    hints: ['The silkiest dribbler in South London.', 'Signed from QPR.', 'Known for his effortless style and long-range goals.', 'Plays for the England national team.']
  },
  {
    name: 'Michael Olise', nationality: 'France', position: 'Forward', club: 'Bayern Munich', league: 'Bundesliga', birthYear: 2001, jerseyNumber: 17, difficulty: 'HARD',
    hints: ['Joined Bayern from Crystal Palace in 2024.', 'Famous for his "no celebration" goals.', 'Born in London, but plays for France.', 'Left-footed winger with elite crossing.']
  },
  {
    name: 'Jean-Philippe Mateta', nationality: 'France', position: 'Striker', club: 'Crystal Palace', league: 'Premier League', birthYear: 1997, jerseyNumber: 14, difficulty: 'HARD',
    hints: ['Known for his "corner flag kick" celebration.', 'Breakout goalscoring season in 2024.', 'Silver medalist at the 2024 Olympics.', 'Joined from Mainz.']
  },
  {
    name: 'Pedro Neto', nationality: 'Portugal', position: 'Forward', club: 'Chelsea', league: 'Premier League', birthYear: 2000, jerseyNumber: 7, difficulty: 'HARD',
    hints: ['Joined Chelsea from Wolves in 2024.', 'Known for his frightening speed and assist numbers.', 'One of the best wingers in the PL when fit.', 'Portuguese international.']
  },
  {
    name: 'Matheus Cunha', nationality: 'Brazil', position: 'Forward', club: 'Wolves', league: 'Premier League', birthYear: 1999, jerseyNumber: 10, difficulty: 'HARD',
    hints: ['Wolves\' creative focal point.', 'Previously played for Atletico Madrid and RB Leipzig.', 'Olympic Gold medalist with Brazil.', 'Known for his flare and fancy footwork.']
  },

  // ─── LEGEND (35 PLAYERS) ──────────────────────────────────
  {
    name: 'Pele', nationality: 'Brazil', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1940, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['The only player to win 3 World Cups.', 'Scored over 1,000 career goals (unofficially).', 'Made the number 10 jersey iconic.', 'Played for Santos and NY Cosmos.']
  },
  {
    name: 'Diego Maradona', nationality: 'Argentina', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1960, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Scored the "Hand of God" and the "Goal of the Century".', 'Carried Napoli to two Serie A titles.', 'Led Argentina to victory in the 1986 World Cup.', 'Regarded by many as the GOAT.']
  },
  {
    name: 'Johan Cruyff', nationality: 'Netherlands', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1947, jerseyNumber: 14, difficulty: 'LEGEND',
    hints: ['The pioneer of "Total Football".', 'Has a famous "turn" named after him.', 'Legend of both Ajax and Barcelona.', 'Won 3 Ballon d\'Ors.']
  },
  {
    name: 'Franz Beckenbauer', nationality: 'Germany', position: 'Defender', club: 'Retired', league: 'Retired', birthYear: 1945, jerseyNumber: 5, difficulty: 'LEGEND',
    hints: ['Nicknamed "Der Kaiser".', 'Invented the "Libero" (sweeper) role.', 'Won the World Cup as both a player and manager.', 'Bayern Munich legend.']
  },
  {
    name: 'Zinedine Zidane', nationality: 'France', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1972, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Scored a famous volley in the 2002 UCL Final.', 'Won the 1998 World Cup on home soil.', 'Famously headbutted Materazzi in his final game.', 'Won 3 UCL titles as Real Madrid manager.']
  },
  {
    name: 'Ronaldinho', nationality: 'Brazil', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1980, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Famous for his constant smile and incredible skills.', 'Won the Ballon d\'Or in 2005.', 'Received a standing ovation at the Bernabeu as a Barca player.', 'Known for the "Elastico" move.']
  },
  {
    name: 'Ronaldo Nazario', nationality: 'Brazil', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1976, jerseyNumber: 9, difficulty: 'LEGEND',
    hints: ['Nicknamed "O Fenomeno".', 'Scored both goals in the 2002 World Cup Final.', 'Played for both Barca and Real, and both Inter and Milan.', 'Widely considered the greatest pure striker ever.']
  },
  {
    name: 'Thierry Henry', nationality: 'France', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1977, jerseyNumber: 14, difficulty: 'LEGEND',
    hints: ['Arsenal\'s all-time record goalscorer.', 'A key part of the "Invincibles".', 'Famous for his side-foot finish and pace.', 'Won the World Cup, Euros, and UCL.']
  },
  {
    name: 'Paolo Maldini', nationality: 'Italy', position: 'Defender', club: 'Retired', league: 'Retired', birthYear: 1968, jerseyNumber: 3, difficulty: 'LEGEND',
    hints: ['Played his entire 25-year career at AC Milan.', 'Won 5 Champions League titles.', 'Inherited the number 3 from his father, Cesare.', 'Renowned for his perfect positioning and tackling.']
  },
  {
    name: 'Lev Yashin', nationality: 'Russia', position: 'Goalkeeper', club: 'Retired', league: 'Retired', birthYear: 1929, jerseyNumber: 1, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Black Spider".', 'The only goalkeeper to win the Ballon d\'Or.', 'Reportedly saved over 150 penalties.', 'Always played in an all-black kit.']
  },
  {
    name: 'George Best', nationality: 'Northern Ireland', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1946, jerseyNumber: 7, difficulty: 'LEGEND',
    hints: ['One of the "Holy Trinity" at Manchester United.', 'Famously said: "Maradona good; Pele better; George Best".', 'The first real "celebrity" footballer.', 'Won the Ballon d\'Or in 1968.']
  },
  {
    name: 'Eusebio', nationality: 'Portugal', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1942, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Black Panther".', 'Benfica\'s greatest ever player.', 'Top scorer at the 1966 World Cup.', 'Known for his speed and powerful right foot.']
  },
  {
    name: 'Gerd Muller', nationality: 'Germany', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1945, jerseyNumber: 9, difficulty: 'LEGEND',
    hints: ['Nicknamed "Der Bomber".', 'Scored the winner in the 1974 World Cup Final.', 'Held the record for most goals in a calendar year until Messi.', 'Bayern Munich legend.']
  },
  {
    name: 'Michel Platini', nationality: 'France', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1955, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Won 3 consecutive Ballon d\'Ors in the 80s.', 'Led France to Euro 1984 glory, scoring 9 goals.', 'Juventus legend.', 'Later became the President of UEFA.']
  },
  {
    name: 'Marco van Basten', nationality: 'Netherlands', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1964, jerseyNumber: 9, difficulty: 'LEGEND',
    hints: ['Scored an impossible volley in the Euro 1988 Final.', 'Won 3 Ballon d\'Ors.', 'Career was tragically cut short by injury at age 28.', 'AC Milan and Ajax legend.']
  },
  {
    name: 'Alfredo Di Stefano', nationality: 'Spain', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1926, jerseyNumber: 9, difficulty: 'LEGEND',
    hints: ['Scored in 5 consecutive European Cup Finals.', 'The most important player in Real Madrid\'s history.', 'The only player to win the "Super Ballon d\'Or".', 'Represented Argentina, Colombia, and Spain.']
  },
  {
    name: 'Ferenc Puskas', nationality: 'Hungary', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1927, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['The FIFA award for "Best Goal" is named after him.', 'The star of the "Magical Magyars" (Hungary 50s).', 'Scored 4 goals in a European Cup Final for Real Madrid.', 'Known for his lethal left foot.']
  },
  {
    name: 'Roberto Baggio', nationality: 'Italy', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1967, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Divine Ponytail".', 'Famously missed the final penalty in the 1994 World Cup.', 'Won the Ballon d\'Or in 1993.', 'Played for Juve, Milan, and Inter.']
  },
  {
    name: 'Andres Iniesta', nationality: 'Spain', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1984, jerseyNumber: 8, difficulty: 'LEGEND',
    hints: ['Scored the winning goal in the 2010 World Cup Final.', 'The master of the "Croqueta" move.', 'A legend of FC Barcelona\'s midfield.', 'Won 35 trophies in his career.']
  },
  {
    name: 'Xavi Hernandez', nationality: 'Spain', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1980, jerseyNumber: 6, difficulty: 'LEGEND',
    hints: ['The brain behind the "Tiki-Taka" era.', 'Recorded 20 assists in a single La Liga season.', 'Won 2 Euros and 1 World Cup with Spain.', 'Barcelona\'s former captain and manager.']
  },
  {
    name: 'Carles Puyol', nationality: 'Spain', position: 'Defender', club: 'Retired', league: 'Retired', birthYear: 1978, jerseyNumber: 5, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Wall" (El Tiburon).', 'Barcelona\'s most iconic captain.', 'Famous for his long curly hair and bravery.', 'Scored the header winner in the 2010 WC Semi-final.']
  },
  {
    name: 'Iker Casillas', nationality: 'Spain', position: 'Goalkeeper', club: 'Retired', league: 'Retired', birthYear: 1981, jerseyNumber: 1, difficulty: 'LEGEND',
    hints: ['Nicknamed "San Iker" (Saint Iker).', 'Captained Spain to 3 consecutive major trophies.', 'Made a miracle save against Robben in 2010.', 'Real Madrid legend.']
  },
  {
    name: 'Steven Gerrard', nationality: 'England', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1980, jerseyNumber: 8, difficulty: 'LEGEND',
    hints: ['Inspired the "Miracle of Istanbul" comeback.', 'The only player to score in a final of the UCL, UEFA Cup, FA Cup, and League Cup.', 'Liverpool\'s greatest captain.', 'Known for his long-range rockets.']
  },
  {
    name: 'Frank Lampard', nationality: 'England', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1978, jerseyNumber: 8, difficulty: 'LEGEND',
    hints: ['The highest-scoring midfielder in Premier League history.', 'Chelsea\'s all-time record goalscorer.', 'Known for his late runs into the box.', 'Won 3 PL titles and 1 UCL.']
  },
  {
    name: 'Paul Scholes', nationality: 'England', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1974, jerseyNumber: 18, difficulty: 'LEGEND',
    hints: ['Zidane called him "The greatest midfielder of his generation".', 'Known for his pin-point long balls and lack of tackling ability.', 'Manchester United "One-Club Man".', 'Won 11 PL titles.']
  },
  {
    name: 'Ryan Giggs', nationality: 'Wales', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1973, jerseyNumber: 11, difficulty: 'LEGEND',
    hints: ['The most decorated player in PL history (13 titles).', 'Manchester United\'s record appearance holder (963 games).', 'Scored in 21 consecutive PL seasons.', 'Known for his incredible longevity.']
  },
  {
    name: 'David Beckham', nationality: 'England', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1975, jerseyNumber: 7, difficulty: 'LEGEND',
    hints: ['Famous for his "bending" free-kicks.', 'Former captain of England.', 'Played for Man Utd, Real Madrid, Milan, PSG, and LA Galaxy.', 'Current owner of Inter Miami.']
  },
  {
    name: 'Wayne Rooney', nationality: 'England', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1985, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Scored a hat-trick on his UCL debut at 18.', 'Manchester United\'s all-time record goalscorer.', 'Famous for his overhead kick against Man City.', 'Began his career at Everton.']
  },
  {
    name: 'Kaka', nationality: 'Brazil', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1982, jerseyNumber: 22, difficulty: 'LEGEND',
    hints: ['The last player to win the Ballon d\'Or before the Messi/Ronaldo era.', 'AC Milan legend.', 'Known for his incredible speed with the ball and elegance.', 'Won the 2002 World Cup.']
  },
  {
    name: 'Francesco Totti', nationality: 'Italy', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1976, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['The "King of Rome".', 'Spent his entire 25-year career at AS Roma.', 'Known for his "Cucchiaio" (chip) penalty technique.', 'Won the 2006 World Cup.']
  },
  {
    name: 'Andrea Pirlo', nationality: 'Italy', position: 'Midfielder', club: 'Retired', league: 'Retired', birthYear: 1979, jerseyNumber: 21, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Architect".', 'Known for his "No Pirlo, No Party" slogan.', 'A master of the deep-lying playmaker role.', 'Legend of both Milan and Juventus.']
  },
  {
    name: 'Alessandro Del Piero', nationality: 'Italy', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1974, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Juventus\' all-time record goalscorer.', 'Famous for the "Del Piero Zone" (curling goals from the left).', 'Stayed with Juve even when they were relegated to Serie B.', 'Won the 2006 World Cup.']
  },
  {
    name: 'Dennis Bergkamp', nationality: 'Netherlands', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1969, jerseyNumber: 10, difficulty: 'LEGEND',
    hints: ['Nicknamed "The Non-Flying Dutchman" (fear of flying).', 'Scored a famous goal vs Newcastle involving a flick-turn.', 'Arsenal and Ajax legend.', 'Has a statue outside the Emirates.']
  },
  {
    name: 'Eric Cantona', nationality: 'France', position: 'Forward', club: 'Retired', league: 'Retired', birthYear: 1966, jerseyNumber: 7, difficulty: 'LEGEND',
    hints: ['Nicknamed "The King".', 'Famous for his turned-up collar.', 'Known for his "Kung-fu kick" on a fan.', 'Transformed Manchester United in the 90s.']
  },
  {
    name: 'Samuel Etoo', nationality: 'Cameroon', position: 'Striker', club: 'Retired', league: 'Retired', birthYear: 1981, jerseyNumber: 9, difficulty: 'LEGEND',
    hints: ['The only player to win back-to-back Trebles with different clubs.', 'Won the UCL with Barca and Inter.', 'Arguably the greatest African striker of all time.', 'Won 4 African Player of the Year awards.']
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  for (const p of PLAYERS_BATCH) {
    const { hints, ...playerData } = p;

    console.log(`Upserting player: ${p.name}`);

    await prisma.player.upsert({
      where: { name: p.name },
      update: {
        ...playerData,
        hints: {
          deleteMany: {},
          create: hints.map((text, index) => ({
            text,
            order: index + 1
          }))
        }
      },
      create: {
        ...playerData,
        hints: {
          create: hints.map((text, index) => ({
            text,
            order: index + 1
          }))
        }
      }
    });
  }

  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });